import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { z } from "zod";

initializeApp();

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const matchSchema = z.array(
  z.object({
    volunteer_id: z.string(),
    match_score: z.coerce.number().min(0).max(100),
    explanation: z.string()
  })
);

const rescoreSchema = z.array(
  z.object({
    need_id: z.string(),
    urgency_score: z.coerce.number().min(1).max(10),
    reason: z.string()
  })
);

function stripJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? text.trim();
  return candidate.slice(candidate.indexOf("["), candidate.lastIndexOf("]") + 1);
}

async function geminiJson<T>(apiKey: string, prompt: string, schema: z.ZodType<T>) {
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });
  const result = await model.generateContent(prompt);
  return schema.parse(JSON.parse(stripJson(result.response.text())));
}

export const matchVolunteersOnNeedCreated = onDocumentCreated(
  {
    document: "needs/{needId}",
    secrets: [geminiApiKey],
    region: "asia-south1"
  },
  async (event) => {
    const need = event.data?.data();
    if (!need || need.status === "resolved") return;

    const db = getFirestore();
    const volunteersSnapshot = await db
      .collection("volunteers")
      .where("orgId", "==", need.orgId)
      .where("isActive", "==", true)
      .limit(25)
      .get();

    const volunteers = volunteersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (!volunteers.length) return;

    const prompt = `You are a volunteer coordination AI. Given the following community need and list of available volunteers, rank the top 3 best matches. For each match output: volunteer_id, match_score (0-100), explanation (1 sentence in simple English). Need: ${JSON.stringify({ id: event.params.needId, ...need })}. Volunteers: ${JSON.stringify(volunteers)}. Return ONLY a valid JSON array.`;
    const matches = await geminiJson(geminiApiKey.value(), prompt, matchSchema);

    await db.collection("needs").doc(event.params.needId).set(
      {
        aiMatches: matches,
        aiMatchedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }
);

export const rescoreOpenNeedsDaily = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "Asia/Kolkata",
    secrets: [geminiApiKey],
    region: "asia-south1"
  },
  async () => {
    const db = getFirestore();
    const snapshot = await db.collection("needs").where("status", "!=", "resolved").limit(100).get();
    const openNeeds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (!openNeeds.length) return;

    const prompt = `You are an NGO operations analyst in India. Re-evaluate urgency scores for all open community needs based on time elapsed, seasonal factors such as floods, heatwaves, school cycles, festivals, and repeated similar reports. Return ONLY a valid JSON array with need_id, urgency_score (1-10), and reason. Today: ${new Date().toISOString()}. Needs: ${JSON.stringify(openNeeds)}`;
    const rescored = await geminiJson(geminiApiKey.value(), prompt, rescoreSchema);

    const batch = db.batch();
    for (const item of rescored) {
      batch.set(
        db.collection("needs").doc(item.need_id),
        {
          urgency_score: item.urgency_score,
          lastRescoreReason: item.reason,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    }
    await batch.commit();
  }
);
