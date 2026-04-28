"use client";

import { useState } from "react";
import { Check, Clock, HandHeart, X } from "lucide-react";
import type { Need, Volunteer } from "@/types";
import { categoryLabel, statusTone } from "@/lib/utils";

export function VolunteerPortal({
  volunteer,
  tasks
}: {
  volunteer: Volunteer;
  tasks: Array<{ need: Need; score: number; explanation: string }>;
}) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="grid h-16 w-16 place-items-center rounded-lg bg-mint text-2xl font-semibold text-leaf">
          {volunteer.name.slice(0, 1)}
        </div>
        <h2 className="mt-4 text-xl font-semibold text-ink">{volunteer.name}</h2>
        <p className="text-sm text-ink/60">{volunteer.location.area}, {volunteer.location.pincode}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-paper p-3">
            <dt className="text-xs uppercase text-ink/55">Impact score</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink">{volunteer.performance_score}</dd>
          </div>
          <div className="rounded-lg bg-paper p-3">
            <dt className="text-xs uppercase text-ink/55">Hours</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink">{volunteer.total_hours}</dd>
          </div>
          <div className="rounded-lg bg-paper p-3">
            <dt className="text-xs uppercase text-ink/55">Completed</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink">{volunteer.tasks_completed}</dd>
          </div>
          <div className="rounded-lg bg-paper p-3">
            <dt className="text-xs uppercase text-ink/55">Weekly</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink">{volunteer.availability.hours_per_week}h</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {volunteer.skills.map((skill) => (
            <span key={skill} className="rounded-md bg-mint px-2 py-1 text-xs font-semibold text-leaf">
              {skill.replaceAll("_", " ")}
            </span>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        {tasks.map((task) => (
          <article key={task.need.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-leaf px-2 py-1 text-sm font-semibold text-white">{task.score}% match</span>
                  <span className="rounded-md bg-paper px-2 py-1 text-sm font-semibold text-ink/70">{categoryLabel(task.need.category)}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-ink">{task.need.title}</h2>
                <p className="mt-1 text-sm text-ink/65">{task.need.location.area}, {task.need.location.city}</p>
              </div>
              <span className={`rounded-md px-3 py-1 text-sm font-semibold capitalize ${statusTone(statuses[task.need.id] ?? "pending")}`}>
                {statuses[task.need.id] ?? "recommended"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/72">{task.need.description}</p>
            <div className="mt-4 rounded-lg bg-mint/55 p-3">
              <p className="text-sm font-semibold text-ink">Why you were matched</p>
              <p className="mt-1 text-sm text-ink/68">{task.explanation}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatuses((current) => ({ ...current, [task.need.id]: "accepted" }))}
                className="inline-flex items-center gap-2 rounded-md bg-leaf px-3 py-2 text-sm font-semibold text-white"
              >
                <Check className="h-4 w-4" aria-hidden />
                Accept
              </button>
              <button
                type="button"
                onClick={() => setStatuses((current) => ({ ...current, [task.need.id]: "declined" }))}
                className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
                Decline
              </button>
              <button
                type="button"
                onClick={() => setStatuses((current) => ({ ...current, [task.need.id]: "completed" }))}
                className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
              >
                <Clock className="h-4 w-4" aria-hidden />
                Complete
              </button>
            </div>
          </article>
        ))}
        <section className="rounded-lg border border-leaf/20 bg-mint p-5">
          <div className="flex items-center gap-3">
            <HandHeart className="h-6 w-6 text-leaf" aria-hidden />
            <h2 className="text-lg font-semibold text-ink">Contribution History</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Your strongest impact has been public health outreach and weekend response. SevaSetu raises your score when coordinators verify timely completion and clear notes.
          </p>
        </section>
      </section>
    </div>
  );
}
