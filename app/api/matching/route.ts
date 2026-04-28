import { NextResponse } from "next/server";
import { needs, volunteers } from "@/lib/data";
import { rankVolunteerMatches } from "@/lib/gemini";
import type { Need, Volunteer } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    need?: Need;
    volunteers?: Volunteer[];
    needId?: string;
  };

  const need = body.need ?? needs.find((item) => item.id === body.needId) ?? needs[0];
  const eligible = body.volunteers ?? volunteers.filter((volunteer) => volunteer.orgId === need.orgId && volunteer.isActive);
  const matches = await rankVolunteerMatches(need, eligible);

  return NextResponse.json({ needId: need.id, matches });
}
