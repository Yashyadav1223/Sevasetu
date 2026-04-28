import { NextResponse } from "next/server";
import { getOpenNeeds } from "@/lib/data";
import { adminDb } from "@/lib/firebaseAdmin";
import { rescoreOpenNeeds } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rescored = await rescoreOpenNeeds(getOpenNeeds());

  try {
    const batch = adminDb().batch();
    for (const item of rescored) {
      batch.update(adminDb().collection("needs").doc(item.need_id), {
        urgency_score: item.urgency_score,
        updatedAt: new Date().toISOString(),
        lastRescoreReason: item.reason
      });
    }
    await batch.commit();
  } catch {
    // The demo remains fully functional when Firebase Admin credentials are absent.
  }

  return NextResponse.json({ updated: rescored.length, rescored });
}
