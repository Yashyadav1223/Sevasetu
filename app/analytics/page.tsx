import { AppShell } from "@/components/AppShell";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { RouteGuard } from "@/components/RouteGuard";
import { assignments, needs, volunteers } from "@/lib/data";

export default function AnalyticsPage() {
  return (
    <AppShell active="/analytics">
      <RouteGuard allowedRoles={["ngo_admin"]}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Evidence for donors and operations</p>
          <h1 className="text-3xl font-semibold text-ink">Analytics</h1>
          <p className="max-w-3xl text-ink/68">
            Track need flow, category mix, unmet district-level pressure, and volunteer contributions with accessible charts.
          </p>
        </div>
        <div className="mt-8">
          <AnalyticsCharts needs={needs} volunteers={volunteers} assignments={assignments} />
        </div>
      </RouteGuard>
    </AppShell>
  );
}
