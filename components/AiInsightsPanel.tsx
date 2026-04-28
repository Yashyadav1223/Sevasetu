"use client";

import { useState } from "react";
import { BrainCircuit, RefreshCcw } from "lucide-react";

type Report = {
  title: string;
  executive_summary: string;
  resolved_needs: string;
  volunteer_hours: string;
  coverage_gaps: string;
  recommendations: string[];
};

const fallbackReport: Report = {
  title: "Asha Mumbai Collective Weekly Impact Report",
  executive_summary:
    "Critical healthcare needs are concentrated in Saki Naka and Malad East, while food distribution and counselling require more weekend volunteers.",
  resolved_needs: "One infrastructure issue was resolved this week through civic coordination.",
  volunteer_hours: "12 verified volunteer hours were logged from completed assignments.",
  coverage_gaps: "Medical, food distribution, and counselling needs have fewer confirmed volunteers than required.",
  recommendations: [
    "Deploy a dengue screening camp in Saki Naka within 48 hours.",
    "Recruit two public-health volunteers for immunisation follow-up calls.",
    "Pair counselling volunteers with local community leaders for safer outreach."
  ]
};

export function AiInsightsPanel({ orgId = "org-mumbai" }: { orgId?: string }) {
  const [report, setReport] = useState<Report>(fallbackReport);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const response = await fetch("/api/impact-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId })
      });
      if (response.ok) setReport((await response.json()) as Report);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-mint">
            <BrainCircuit className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">Gemini Weekly Brief</span>
          </div>
          <h2 className="mt-3 text-xl font-semibold">{report.title}</h2>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-white/10 p-2 text-white transition hover:bg-white/20"
          aria-label="Refresh AI impact report"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/78">{report.executive_summary}</p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white/8 p-3">
          <dt className="text-xs uppercase text-white/55">Resolved</dt>
          <dd className="mt-1 text-sm text-white/82">{report.resolved_needs}</dd>
        </div>
        <div className="rounded-lg bg-white/8 p-3">
          <dt className="text-xs uppercase text-white/55">Hours</dt>
          <dd className="mt-1 text-sm text-white/82">{report.volunteer_hours}</dd>
        </div>
      </dl>
      <div className="mt-5 rounded-lg bg-white/8 p-3">
        <p className="text-xs uppercase text-white/55">Coverage gaps</p>
        <p className="mt-1 text-sm text-white/82">{report.coverage_gaps}</p>
      </div>
      <ul className="mt-5 space-y-2">
        {report.recommendations.map((item) => (
          <li key={item} className="rounded-md bg-mint px-3 py-2 text-sm font-medium text-ink">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
