import { AppShell } from "@/components/AppShell";
import { FieldReportForm } from "@/components/FieldReportForm";
import { RouteGuard } from "@/components/RouteGuard";

export default function FieldReportPage() {
  return (
    <AppShell active="/field-report">
      <div className="mx-auto max-w-3xl">
        <RouteGuard allowedRoles={["field_worker", "ngo_admin"]}>
          <FieldReportForm />
        </RouteGuard>
      </div>
    </AppShell>
  );
}
