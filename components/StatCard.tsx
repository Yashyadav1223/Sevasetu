import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "leaf"
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: "leaf" | "river" | "saffron" | "rose";
}) {
  const tones = {
    leaf: "bg-leaf/10 text-leaf",
    river: "bg-river/10 text-river",
    saffron: "bg-saffron/20 text-[#8a530f]",
    rose: "bg-rose/10 text-rose"
  };

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm" aria-label={label}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink/60">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-ink">{value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-md ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="mt-4 text-sm text-ink/65">{helper}</p>
    </section>
  );
}
