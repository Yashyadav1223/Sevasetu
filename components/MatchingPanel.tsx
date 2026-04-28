"use client";

import { useState } from "react";
import { CheckCircle2, Info, UserCheck } from "lucide-react";
import type { Need, Volunteer } from "@/types";
import { categoryLabel } from "@/lib/utils";

export type MatchGroup = {
  need: Need;
  matches: Array<{
    volunteer: Volunteer;
    score: number;
    explanation: string;
  }>;
};

export function MatchingPanel({ groups }: { groups: MatchGroup[] }) {
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.need.id} className="rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-rose/10 px-2 py-1 text-xs font-semibold text-rose">
                    Urgency {group.need.urgency_score}/10
                  </span>
                  <span className="rounded-md bg-paper px-2 py-1 text-xs font-semibold text-ink/70">
                    {categoryLabel(group.need.category)}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-ink">{group.need.title}</h2>
                <p className="mt-1 text-sm text-ink/68">{group.need.location.area}, {group.need.location.pincode}</p>
              </div>
              {assigned[group.need.id] && (
                <span className="inline-flex items-center gap-2 rounded-md bg-leaf/10 px-3 py-2 text-sm font-semibold text-leaf">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Assigned to {assigned[group.need.id]}
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-3">
            {group.matches.map((match) => (
              <article key={match.volunteer.id} className="group relative rounded-lg border border-ink/10 bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{match.volunteer.name}</h3>
                    <p className="mt-1 text-sm text-ink/60">{match.volunteer.location.area}</p>
                  </div>
                  <span className="rounded-md bg-leaf px-2 py-1 text-sm font-semibold text-white">{match.score}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/72">{match.explanation}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {match.volunteer.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-md bg-white px-2 py-1 text-xs font-medium text-ink/70">
                      {skill.replaceAll("_", " ")}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-ink/55">
                    <Info className="h-3.5 w-3.5" aria-hidden />
                    {match.volunteer.tasks_completed} tasks completed
                  </span>
                  <button
                    type="button"
                    onClick={() => setAssigned((current) => ({ ...current, [group.need.id]: match.volunteer.name }))}
                    className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-leaf"
                  >
                    <UserCheck className="h-4 w-4" aria-hidden />
                    Assign
                  </button>
                </div>
                <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 hidden rounded-lg border border-ink/10 bg-white p-4 opacity-0 shadow-soft transition group-hover:block group-hover:opacity-100">
                  <p className="text-sm font-semibold text-ink">{match.volunteer.name}</p>
                  <p className="mt-1 text-xs text-ink/60">
                    Performance {match.volunteer.performance_score}/10, {match.volunteer.total_hours} hours logged, available {match.volunteer.availability.days.join(", ")}.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
