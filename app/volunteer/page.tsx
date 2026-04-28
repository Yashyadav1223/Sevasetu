import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { VolunteerPortal } from "@/components/VolunteerPortal";
import { VolunteerRegistration } from "@/components/VolunteerRegistration";
import { getVolunteerTasks, volunteers } from "@/lib/data";

export default function VolunteerPage() {
  const volunteer = volunteers[0];
  const tasks = getVolunteerTasks(volunteer.id).slice(0, 5);

  return (
    <AppShell active="/volunteer">
      <RouteGuard allowedRoles={["volunteer"]}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Volunteer experience</p>
          <h1 className="text-3xl font-semibold text-ink">Matched Tasks and Impact</h1>
          <p className="max-w-3xl text-ink/68">
            Volunteers receive explainable recommendations, can accept or decline, and log completion for impact scoring.
          </p>
        </div>
        <div className="mt-8 grid gap-6">
          <VolunteerRegistration />
          <VolunteerPortal volunteer={volunteer} tasks={tasks} />
        </div>
      </RouteGuard>
    </AppShell>
  );
}
