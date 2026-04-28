import { Award, MapPinned } from "lucide-react";
import type { Assignment, Need, NeedCategory, Volunteer } from "@/types";
import { categoryLabel, formatNumber } from "@/lib/utils";

function byDay(needs: Need[]) {
  const days = ["Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27"];
  return days.map((day, index) => ({
    day,
    submitted: [3, 5, 4, 7, 6, 8, 9][index],
    resolved: [1, 2, 2, 3, 3, 4, needs.filter((need) => need.status === "resolved").length][index]
  }));
}

export function AnalyticsCharts({
  needs,
  volunteers,
  assignments
}: {
  needs: Need[];
  volunteers: Volunteer[];
  assignments: Assignment[];
}) {
  const timeline = byDay(needs);
  const maxLineValue = Math.max(...timeline.flatMap((item) => [item.submitted, item.resolved]));
  const categories = Object.entries(
    needs.reduce<Record<string, number>>((acc, need) => {
      acc[need.category] = (acc[need.category] ?? 0) + 1;
      return acc;
    }, {})
  );
  const maxCategory = Math.max(...categories.map(([, value]) => value));
  const hotspots = needs
    .filter((need) => need.status !== "resolved")
    .sort((a, b) => b.urgency_score * b.estimated_affected - a.urgency_score * a.estimated_affected)
    .slice(0, 6);
  const leaders = volunteers.slice().sort((a, b) => b.total_hours - a.total_hours).slice(0, 5);
  const completedHours = assignments.reduce((sum, item) => sum + (item.hoursLogged ?? 0), 0);

  const submittedPoints = timeline
    .map((item, index) => `${(index / (timeline.length - 1)) * 100},${100 - (item.submitted / maxLineValue) * 88}`)
    .join(" ");
  const resolvedPoints = timeline
    .map((item, index) => `${(index / (timeline.length - 1)) * 100},${100 - (item.resolved / maxLineValue) * 88}`)
    .join(" ");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Needs Submitted vs Resolved</h2>
            <p className="text-sm text-ink/60">Weekly operating trend for coordinators.</p>
          </div>
          <span className="rounded-md bg-mint px-3 py-1 text-sm font-semibold text-leaf">{completedHours} hours logged</span>
        </div>
        <div className="mt-6 h-64">
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" role="img" aria-label="Line chart of submitted and resolved needs">
            <polyline points={submittedPoints} fill="none" stroke="#c6415d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={resolvedPoints} fill="none" stroke="#0f7a5f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {timeline.map((item, index) => (
              <text key={item.day} x={(index / (timeline.length - 1)) * 100} y="108" textAnchor="middle" fontSize="4" fill="#5c6965">
                {item.day}
              </text>
            ))}
          </svg>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose" />Submitted</span>
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-leaf" />Resolved</span>
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Needs by Category</h2>
        <div className="mt-6 space-y-3">
          {categories.map(([category, value]) => (
            <div key={category}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{categoryLabel(category as NeedCategory)}</span>
                <span className="text-ink/60">{value}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-paper">
                <div className="h-3 rounded-full bg-river" style={{ width: `${(value / maxCategory) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-leaf" aria-hidden />
          <h2 className="text-lg font-semibold text-ink">Unmet Need Heatmap</h2>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {hotspots.map((need) => {
            const intensity = Math.min(1, (need.urgency_score * need.estimated_affected) / 5000);
            return (
              <div
                key={need.id}
                className="rounded-lg p-4 text-white"
                style={{ backgroundColor: `rgba(198, 65, 93, ${0.45 + intensity * 0.5})` }}
              >
                <p className="font-semibold">{need.location.area}</p>
                <p className="mt-1 text-xs text-white/80">{formatNumber(need.estimated_affected)} affected</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-saffron" aria-hidden />
          <h2 className="text-lg font-semibold text-ink">Volunteer Leaderboard</h2>
        </div>
        <div className="mt-5 space-y-3">
          {leaders.map((volunteer, index) => (
            <div key={volunteer.id} className="flex items-center gap-3 rounded-lg bg-paper p-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-semibold text-white">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{volunteer.name}</p>
                <p className="text-sm text-ink/60">{volunteer.tasks_completed} tasks, score {volunteer.performance_score}</p>
              </div>
              <span className="rounded-md bg-mint px-2 py-1 text-sm font-semibold text-leaf">{volunteer.total_hours}h</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
