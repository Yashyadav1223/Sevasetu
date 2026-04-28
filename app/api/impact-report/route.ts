import { NextResponse } from "next/server";
import { assignments, getOrgById, needs, volunteers } from "@/lib/data";
import { generateImpactReport } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { orgId?: string };
  const orgId = body.orgId ?? "org-mumbai";
  const organization = getOrgById(orgId);

  const report = await generateImpactReport({
    organization,
    needs: needs.filter((need) => need.orgId === orgId),
    volunteers: volunteers.filter((volunteer) => volunteer.orgId === orgId),
    assignments: assignments.filter((assignment) => assignment.orgId === orgId)
  });

  return NextResponse.json(report);
}
