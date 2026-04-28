"use client";

import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingBlock } from "@/components/LoadingBlock";
import { auth, firebaseConfigured } from "@/lib/firebase";
import type { Role } from "@/types";

export function RouteGuard({
  allowedRoles,
  children
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed" | "forbidden">(
    firebaseConfigured ? "checking" : "allowed"
  );

  useEffect(() => {
    if (!firebaseConfigured) return;

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const token = await user.getIdTokenResult();
      const role = token.claims.role;
      setStatus(typeof role === "string" && allowedRoles.includes(role as Role) ? "allowed" : "forbidden");
    });
  }, [allowedRoles, pathname, router]);

  if (status === "checking") return <LoadingBlock label="Checking access" />;

  if (status === "forbidden") {
    return (
      <section className="rounded-lg border border-rose/20 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose">403</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">This role cannot access this page</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Ask the Firebase admin to assign the correct custom claim for your account.
        </p>
      </section>
    );
  }

  return children;
}
