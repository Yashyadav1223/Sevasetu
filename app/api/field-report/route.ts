import { NextResponse } from "next/server";
import { adminAuth, adminDb, adminServiceAccountConfigured } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (adminServiceAccountConfigured()) {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth().verifyIdToken(token).catch(() => null);
    const role = decoded?.role;
    if (role !== "field_worker" && role !== "ngo_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const report = {
    ...body,
    createdAt: new Date().toISOString(),
    status: "submitted"
  };

  try {
    const ref = await adminDb().collection("field_reports").add(report);
    return NextResponse.json({ id: ref.id, saved: true, report });
  } catch {
    return NextResponse.json({ id: `local-${Date.now()}`, saved: false, report });
  }
}
