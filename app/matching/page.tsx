import { AppShell } from "@/components/AppShell";
import { MatchingPanel } from "@/components/MatchingPanel";
import { RouteGuard } from "@/components/RouteGuard";
import { getMatchesForNeed, getOpenNeeds } from "@/lib/data";

export default function MatchingPage() {
  const groups = getOpenNeeds()
    .slice(0, 6)
    .map((need) => ({
      need,
      matches: getMatchesForNeed(need)
    }));

  return (
    <AppShell active="/matching">
      <RouteGuard allowedRoles={["ngo_admin"]}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Human-in-the-loop AI</p>
          <h1 className="text-3xl font-semibold text-ink">Volunteer Matching Panel</h1>
          <p className="max-w-3xl text-ink/68">
            Coordinators see the top three AI-recommended volunteers for each open need, with a simple explanation before approval.
          </p>
        </div>
        <div className="mt-8">
          <MatchingPanel groups={groups} />
        </div>
      </RouteGuard>
    </AppShell>
  );
}
