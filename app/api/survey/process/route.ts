import { NextResponse } from "next/server";
import { processSurveyText } from "@/lib/gemini";

export const runtime = "nodejs";

async function extractTextFromRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const text = form.get("text");

    if (typeof text === "string" && text.trim()) return text;

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdfParse = (await import("pdf-parse")).default;
        const parsed = await pdfParse(buffer);
        return parsed.text;
      }
      return buffer.toString("utf8");
    }
  }

  const body = (await request.json().catch(() => ({}))) as { rawText?: string };
  return body.rawText ?? "";
}

export async function POST(request: Request) {
  const rawText = await extractTextFromRequest(request);

  if (!rawText.trim()) {
    return NextResponse.json({ error: "Survey text or file is required." }, { status: 400 });
  }

  const result = await processSurveyText(rawText);
  return NextResponse.json(result);
}
