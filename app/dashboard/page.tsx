import { Activity, Clock3, HandHeart, ListChecks } from "lucide-react";
import { AiInsightsPanel } from "@/components/AiInsightsPanel";
import { AppShell } from "@/components/AppShell";
import { MapPanel } from "@/components/MapPanel";
import { PriorityNeedsTable } from "@/components/PriorityNeedsTable";
import { RouteGuard } from "@/components/RouteGuard";
import { StatCard } from "@/components/StatCard";
import { SurveyUpload } from "@/components/SurveyUpload";
import { dashboardOrgId, needs, volunteers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const orgNeeds = needs.filter((need) => need.orgId === dashboardOrgId);
  const openNeeds = orgNeeds.filter((need) => need.status !== "resolved");
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.orgId === dashboardOrgId && volunteer.isActive);
  const resolvedThisWeek = orgNeeds.filter((need) => need.status === "resolved").length;

  return (
    <AppShell active="/dashboard">
      <RouteGuard allowedRoles={["ngo_admin"]}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Coordinator command center</p>
          <h1 className="text-3xl font-semibold text-ink">NGO Dashboard</h1>
          <p className="max-w-3xl text-ink/68">
            AI-ranked needs, real-time style volunteer coverage, upload-driven survey intelligence, and coordinator-readable weekly insights.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Open Needs" value={formatNumber(openNeeds.length)} helper="Sorted by urgency and affected people." icon={ListChecks} tone="rose" />
          <StatCard label="Active Volunteers" value={formatNumber(activeVolunteers.length)} helper="Available for AI-assisted matching." icon={HandHeart} tone="leaf" />
          <StatCard label="Resolved This Week" value={formatNumber(resolvedThisWeek)} helper="Verified by completion notes." icon={Activity} tone="river" />
          <StatCard label="Avg Response Time" value="18h" helper="Demo metric from assignment timestamps." icon={Clock3} tone="saffron" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
          <PriorityNeedsTable needs={orgNeeds} />
          <AiInsightsPanel orgId={dashboardOrgId} />
        </div>

        <div className="mt-6">
          <MapPanel needs={orgNeeds} volunteers={activeVolunteers} />
        </div>

        <div className="mt-6">
          <SurveyUpload />
        </div>
      </RouteGuard>
    </AppShell>
  );
}
