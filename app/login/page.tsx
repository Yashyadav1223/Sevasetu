import { AppShell } from "@/components/AppShell";
import { AuthPanel } from "@/components/AuthPanel";

export default function LoginPage() {
  return (
    <AppShell active="/login">
      <div className="mx-auto max-w-4xl">
        <AuthPanel />
      </div>
    </AppShell>
  );
}
