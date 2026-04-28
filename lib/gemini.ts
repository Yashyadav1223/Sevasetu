import "server-only";

import crypto from "node:crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import type {
  ExtractedNeed,
  ImpactReportPayload,
  MatchRecommendation,
  Need,
  NeedCategory,
  SurveyProcessingResult,
  Volunteer
} from "@/types";
import { adminDb } from "@/lib/firebaseAdmin";
import { deterministicMatchScore, explainFallbackMatch } from "@/lib/utils";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-pro";
const MAX_RETRIES = 3;

const categorySchema = z.enum([
  "healthcare",
  "education",
  "infrastructure",
  "food",
  "mental_health",
  "disaster_relief",
  "other"
]);

const extractedNeedSchema = z.object({
  location: z.string().min(1),
  category: categorySchema,
  description: z.string().min(1),
  estimated_people_affected: z.coerce.number().int().min(0),
  urgency_score: z.coerce.number().min(1).max(10),
  skills_needed: z.array(z.string().min(1)).default([])
});

const extractedNeedArraySchema: z.ZodType<ExtractedNeed[], z.ZodTypeDef, unknown> = z.array(extractedNeedSchema).transform((items) =>
  items.map((item) => ({
    ...item,
    skills_needed: item.skills_needed ?? []
  }))
);

const matchSchema = z.object({
  volunteer_id: z.string().min(1),
  match_score: z.coerce.number().min(0).max(100),
  explanation: z.string().min(1)
});

const rescoreSchema = z.object({
  need_id: z.string().min(1),
  urgency_score: z.coerce.number().min(1).max(10),
  reason: z.string().min(1)
});

export type RescoredNeed = z.infer<typeof rescoreSchema>;

async function getCached<T>(cacheKey: string): Promise<T | null> {
  try {
    const snapshot = await adminDb().collection("gemini_cache").doc(cacheKey).get();
    if (!snapshot.exists) return null;
    const data = snapshot.data() as { value: T; expiresAt?: number } | undefined;
    if (!data?.value) return null;
    if (data.expiresAt && data.expiresAt < Date.now()) return null;
    return data.value;
  } catch {
    return null;
  }
}

async function setCached<T>(cacheKey: string, value: T, ttlHours = 24) {
  try {
    await adminDb()
      .collection("gemini_cache")
      .doc(cacheKey)
      .set({
        value,
        createdAt: Date.now(),
        expiresAt: Date.now() + ttlHours * 60 * 60 * 1000
      });
  } catch {
    // Cache misses must never block NGO workflows.
  }
}

function hashPrompt(prompt: string) {
  return crypto.createHash("sha256").update(`${MODEL_NAME}:${prompt}`).digest("hex");
}

function stripJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? trimmed;
  const firstArray = candidate.indexOf("[");
  const firstObject = candidate.indexOf("{");
  const first = [firstArray, firstObject].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? 0;
  const lastArray = candidate.lastIndexOf("]");
  const lastObject = candidate.lastIndexOf("}");
  const last = Math.max(lastArray, lastObject);
  return candidate.slice(first, last + 1);
}

async function callGeminiText(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      responseMimeType: "application/json"
    }
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 450));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Gemini request failed.");
}

async function callGeminiJson<T>(prompt: string, schema: z.ZodType<T, z.ZodTypeDef, unknown>, ttlHours = 24): Promise<T> {
  const cacheKey = hashPrompt(prompt);
  const cached = await getCached<T>(cacheKey);
  if (cached) return cached;

  const text = await callGeminiText(prompt);
  const parsed = JSON.parse(stripJson(text)) as unknown;
  const validated = schema.parse(parsed);
  await setCached(cacheKey, validated, ttlHours);
  return validated;
}

function normalizeCategory(value: string): NeedCategory {
  const lower = value.toLowerCase().replace(/\s+/g, "_");
  if (lower.includes("health")) return "healthcare";
  if (lower.includes("school") || lower.includes("education") || lower.includes("teach")) return "education";
  if (lower.includes("water") || lower.includes("road") || lower.includes("drain") || lower.includes("repair")) return "infrastructure";
  if (lower.includes("food") || lower.includes("ration") || lower.includes("nutrition")) return "food";
  if (lower.includes("mental") || lower.includes("counsel")) return "mental_health";
  if (lower.includes("flood") || lower.includes("cyclone") || lower.includes("relief")) return "disaster_relief";
  return "other";
}

function fallbackSurveyExtraction(rawText: string): ExtractedNeed[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const rows = lines.slice(lines[0]?.toLowerCase().includes("area") || lines[0]?.includes(",") ? 1 : 0);

  return rows.slice(0, 20).map((line, index) => {
    const columns = line.split(",").map((item) => item.trim()).filter(Boolean);
    const location = columns[0] || "Unspecified area";
    const description = columns.slice(2).join(", ") || columns[1] || line;
    const people = Number(columns.find((item) => /^\d+$/.test(item)) ?? 50 + index * 15);
    const category = normalizeCategory(description);
    const urgency_score = /critical|flood|fever|unsafe|urgent|high/i.test(line) ? 8 : /medium|moderate/i.test(line) ? 6 : 5;
    const skillsByCategory: Record<NeedCategory, string[]> = {
      healthcare: ["medical", "public_health"],
      education: ["teaching", "mentoring"],
      infrastructure: ["construction", "logistics"],
      food: ["food_distribution", "logistics"],
      mental_health: ["counselling", "community_mobilization"],
      disaster_relief: ["disaster_relief", "logistics"],
      other: ["community_mobilization"]
    };

    return {
      location,
      category,
      description,
      estimated_people_affected: Number.isFinite(people) ? people : 50,
      urgency_score,
      skills_needed: skillsByCategory[category]
    };
  });
}

function fallbackSummary(needs: ExtractedNeed[]) {
  const top = needs
    .slice()
    .sort((a, b) => b.urgency_score - a.urgency_score)
    .slice(0, 5)
    .map((need, index) => `${index + 1}. ${need.location}: ${need.description}`)
    .join(" ");
  return top
    ? `Top community priorities identified from the upload are: ${top}`
    : "No reliable needs were extracted yet. Ask field workers to submit clearer location, affected people, and urgency details.";
}

export async function extractNeedsFromSurvey(rawSurveyData: string) {
  const prompt = `You are a social impact analyst. Given the following raw community survey data from India, extract and structure all mentioned community needs. For each need, output: location (area/pincode), category (healthcare/education/infrastructure/food/mental_health/other), description, estimated_people_affected, urgency_score (1-10 based on severity and frequency of mention), and skills_needed (array). Return ONLY a valid JSON array. Survey data: ${rawSurveyData}`;

  try {
    return {
      needs: await callGeminiJson<ExtractedNeed[]>(prompt, extractedNeedArraySchema, 72),
      source: "gemini" as const
    };
  } catch {
    return {
      needs: fallbackSurveyExtraction(rawSurveyData),
      source: "fallback" as const
    };
  }
}

export async function dedupeAndClusterNeeds(incoming: ExtractedNeed[], existing: ExtractedNeed[] = []) {
  if (!incoming.length) return [];

  const prompt = `You are cleaning NGO survey data from India. Merge duplicate or near-duplicate needs that refer to the same location, category, and problem. Keep the highest urgency score, combine skill requirements, and increase estimated_people_affected only when the records describe distinct households. Return ONLY a valid JSON array with this exact schema: location, category, description, estimated_people_affected, urgency_score, skills_needed. Existing needs: ${JSON.stringify(existing)} Incoming needs: ${JSON.stringify(incoming)}`;

  try {
    return await callGeminiJson<ExtractedNeed[]>(prompt, extractedNeedArraySchema, 72);
  } catch {
    const map = new Map<string, ExtractedNeed>();
    for (const need of [...existing, ...incoming]) {
      const key = `${need.location.toLowerCase()}-${need.category}-${need.description.slice(0, 32).toLowerCase()}`;
      const current = map.get(key);
      if (!current) {
        map.set(key, need);
      } else {
        map.set(key, {
          ...current,
          urgency_score: Math.max(current.urgency_score, need.urgency_score),
          estimated_people_affected: Math.max(current.estimated_people_affected, need.estimated_people_affected),
          skills_needed: Array.from(new Set([...current.skills_needed, ...need.skills_needed]))
        });
      }
    }
    return Array.from(map.values());
  }
}

export async function summarizeSurveyProblems(needs: ExtractedNeed[], region = "the submitted region") {
  const prompt = `You are preparing a simple NGO coordinator briefing. Summarize the top 5 community problems in ${region} from these structured needs. Use simple, non-technical English, 5 short bullets, and include why each problem matters. Return ONLY a JSON object with one string property named "summary". Needs: ${JSON.stringify(needs)}`;

  try {
    const result = await callGeminiJson(prompt, z.object({ summary: z.string().min(1) }), 72);
    return result.summary;
  } catch {
    return fallbackSummary(needs);
  }
}

export async function processSurveyText(rawSurveyData: string, existingNeeds: ExtractedNeed[] = []): Promise<SurveyProcessingResult> {
  const extracted = await extractNeedsFromSurvey(rawSurveyData);
  const dedupedNeeds = await dedupeAndClusterNeeds(extracted.needs, existingNeeds);
  const summary = await summarizeSurveyProblems(dedupedNeeds);

  return {
    needs: extracted.needs,
    dedupedNeeds,
    summary,
    source: extracted.source
  };
}

export async function rankVolunteerMatches(need: Need, availableVolunteers: Volunteer[]): Promise<MatchRecommendation[]> {
  const prompt = `You are a volunteer coordination AI. Given the following community need and list of available volunteers, rank the top 3 best matches. For each match output: volunteer_id, match_score (0-100), explanation (1 sentence in simple English). Need: ${JSON.stringify(need)}. Volunteers: ${JSON.stringify(availableVolunteers)}. Return ONLY a valid JSON array.`;

  try {
    return await callGeminiJson(prompt, z.array(matchSchema).max(3), 12);
  } catch {
    return availableVolunteers
      .filter((volunteer) => volunteer.isActive)
      .map((volunteer) => ({
        volunteer_id: volunteer.id,
        match_score: deterministicMatchScore(need, volunteer),
        explanation: explainFallbackMatch(need, volunteer)
      }))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3);
  }
}

export async function generateImpactReport(payload: ImpactReportPayload) {
  const prompt = `You are writing a weekly NGO impact report for donors and field coordinators in India. Use simple, non-technical English. Summarize needs resolved, volunteer hours, coverage gaps, and recommendations for next week. Return ONLY a JSON object with keys title, executive_summary, resolved_needs, volunteer_hours, coverage_gaps, recommendations. Data: ${JSON.stringify(payload)}`;
  const schema = z.object({
    title: z.string(),
    executive_summary: z.string(),
    resolved_needs: z.string(),
    volunteer_hours: z.string(),
    coverage_gaps: z.string(),
    recommendations: z.array(z.string())
  });

  try {
    return await callGeminiJson(prompt, schema, 24);
  } catch {
    const resolved = payload.needs.filter((need) => need.status === "resolved").length;
    const hours = payload.assignments.reduce((sum, item) => sum + (item.hoursLogged ?? 0), 0);
    const openCritical = payload.needs.filter((need) => need.status !== "resolved" && need.urgency_score >= 8);
    return {
      title: `${payload.organization.name} Weekly Impact Report`,
      executive_summary: `${payload.organization.name} resolved ${resolved} needs and has ${openCritical.length} critical needs requiring coordinator attention.`,
      resolved_needs: `${resolved} needs were marked resolved in the current reporting window.`,
      volunteer_hours: `${hours} volunteer hours were logged through completed assignments.`,
      coverage_gaps: openCritical.map((need) => need.title).join(", ") || "No critical gaps are currently visible.",
      recommendations: [
        "Assign high-urgency open needs within 24 hours.",
        "Recruit volunteers for skills that appear repeatedly in open needs.",
        "Use field reports to validate locations before large deployment."
      ]
    };
  }
}

export async function rescoreOpenNeeds(openNeeds: Need[]): Promise<RescoredNeed[]> {
  const prompt = `You are an NGO operations analyst in India. Re-evaluate urgency scores for all open community needs based on time elapsed, seasonal factors such as floods, heatwaves, school cycles, festivals, and repeated similar reports. Return ONLY a valid JSON array with need_id, urgency_score (1-10), and reason. Today: ${new Date().toISOString()}. Needs: ${JSON.stringify(openNeeds)}`;

  try {
    return await callGeminiJson(prompt, z.array(rescoreSchema), 8);
  } catch {
    return openNeeds.map((need) => {
      const ageDays = Math.max(0, Math.floor((Date.now() - new Date(need.createdAt).getTime()) / 86_400_000));
      const seasonalBoost = /flood|heat|cyclone|dengue|fever|water/i.test(`${need.title} ${need.description}`) ? 1 : 0;
      return {
        need_id: need.id,
        urgency_score: Math.min(10, Math.max(1, Math.round(need.urgency_score + Math.min(2, ageDays / 10) + seasonalBoost))),
        reason: "Fallback score increased for older unresolved needs and seasonal risk keywords."
      };
    });
  }
}
