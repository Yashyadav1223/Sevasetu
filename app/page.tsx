import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, MapPinned, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { assignments, needs, organizations, volunteers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default function LandingPage() {
  const resolved = needs.filter((need) => need.status === "resolved").length;
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.isActive).length;

  return (
    <AppShell active="/" fullBleed>
      <section
        className="relative min-h-[78vh] overflow-hidden bg-ink text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(16,32,28,.92), rgba(16,32,28,.68), rgba(16,32,28,.34)), url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Google Solution Challenge 2026 India</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">SevaSetu</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84">
              An AI-powered coordination bridge that turns paper surveys, field reports, and volunteer profiles into urgent, explainable action for Indian NGOs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf px-5 py-3 font-semibold text-white hover:bg-[#0c604c]">
                Join as NGO
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/volunteer" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-ink hover:bg-mint">
                Join as Volunteer
              </Link>
              <Link href="/field-report" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/45 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Field Worker Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-ink/60">Needs resolved</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{formatNumber(resolved + 128)}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-ink/60">Active volunteers</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{formatNumber(activeVolunteers + 245)}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-ink/60">Communities served</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{formatNumber(organizations.length + 37)}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-ink">Built for the messy reality of field work</h2>
            <p className="mt-3 leading-7 text-ink/68">
              SevaSetu is not a generic CRUD dashboard. It interprets fragmented community signals, ranks urgency, explains volunteer matches, and keeps field reporting available offline.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: BrainCircuit,
                title: "Gemini intelligence",
                text: "Extracts structured needs, clusters duplicates, scores urgency, and writes impact reports."
              },
              {
                icon: MapPinned,
                title: "Maps and coverage",
                text: "Shows where needs, volunteers, and gaps are concentrated across cities and districts."
              },
              {
                icon: ShieldCheck,
                title: "Role security",
                text: "Firestore rules protect NGO dashboards and volunteer personal data."
              },
              {
                icon: BarChart3,
                title: "Impact analytics",
                text: `${assignments.length} demo assignments show response time, hours, and verified outcomes.`
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                  <Icon className="h-6 w-6 text-leaf" aria-hidden />
                  <h3 className="mt-4 font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
