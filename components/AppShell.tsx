import Link from "next/link";
import { Activity, BarChart3, ClipboardList, HandHeart, Home, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: Array<{ href: string; label: string; icon: typeof Home }> = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "NGO Dashboard", icon: Activity },
  { href: "/matching", label: "Matching", icon: Users },
  { href: "/volunteer", label: "Volunteer", icon: HandHeart },
  { href: "/field-report", label: "Field Report", icon: ClipboardList },
  { href: "/analytics", label: "Analytics", icon: BarChart3 }
];

export function AppShell({
  children,
  active,
  fullBleed = false
}: {
  children: React.ReactNode;
  active?: string;
  fullBleed?: boolean;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink" aria-label="SevaSetu home">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-leaf text-white">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg">SevaSetu</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-mint hover:text-ink",
                    isActive && "bg-mint text-ink"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/login"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf"
          >
            Demo Login
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-ink/10 px-4 py-2 lg:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink/70",
                  active === item.href && "bg-mint text-ink"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className={cn(!fullBleed && "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8")}>{children}</main>
    </div>
  );
}
