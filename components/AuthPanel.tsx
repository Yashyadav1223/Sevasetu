"use client";

import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { auth, firebaseConfigured, googleProvider } from "@/lib/firebase";
import type { Role } from "@/types";

const roles: Array<{ role: Role; title: string; helper: string }> = [
  {
    role: "ngo_admin",
    title: "NGO Admin",
    helper: "Full dashboard, uploads, AI review, assignment approval."
  },
  {
    role: "volunteer",
    title: "Volunteer",
    helper: "Personal task recommendations and contribution history."
  },
  {
    role: "field_worker",
    title: "Field Worker",
    helper: "Mobile need reports, photos, GPS, and offline sync."
  }
];

export function AuthPanel() {
  const [role, setRole] = useState<Role>("ngo_admin");
  const [status, setStatus] = useState(firebaseConfigured ? "Firebase is configured." : "Demo mode uses local role switching until Firebase keys are added.");

  async function login() {
    if (!firebaseConfigured) {
      setStatus(`Demo signed in as ${role.replace("_", " ")}.`);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      setStatus(`Signed in. Assign the ${role} custom claim from your admin console or Cloud Function.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Sign-in failed.");
    }
  }

  async function logout() {
    if (firebaseConfigured) await signOut(auth);
    setStatus("Signed out.");
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Role-Based Access</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Firebase Authentication handles identity. Firestore rules enforce coordinator, volunteer, and field-worker boundaries with custom claims.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {roles.map((item) => (
          <button
            key={item.role}
            type="button"
            onClick={() => setRole(item.role)}
            className={`rounded-lg border p-4 text-left transition ${
              role === item.role ? "border-leaf bg-mint" : "border-ink/10 bg-paper hover:border-leaf/50"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-ink">
              {item.role === "ngo_admin" && <ShieldCheck className="h-5 w-5 text-leaf" aria-hidden />}
              {item.role === "volunteer" && <UserRound className="h-5 w-5 text-river" aria-hidden />}
              {item.role === "field_worker" && <UsersRound className="h-5 w-5 text-saffron" aria-hidden />}
              {item.title}
            </div>
            <p className="mt-2 text-sm text-ink/65">{item.helper}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={login} className="rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white">
          Continue with Google
        </button>
        <button type="button" onClick={logout} className="rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink">
          Sign out
        </button>
      </div>
      <p className="mt-4 rounded-md bg-paper px-3 py-2 text-sm text-ink/70">{status}</p>
    </section>
  );
}
