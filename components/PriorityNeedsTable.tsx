"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";
import type { Need } from "@/types";
import { categoryLabel, cn, formatNumber, urgencyLabel, urgencyTone } from "@/lib/utils";

type SortKey = "urgency_score" | "category" | "location" | "estimated_affected";

export function PriorityNeedsTable({ needs }: { needs: Need[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("urgency_score");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const sorted = useMemo(() => {
    return needs.slice().sort((a, b) => {
      if (sortKey === "urgency_score" || sortKey === "estimated_affected") return Number(b[sortKey]) - Number(a[sortKey]);
      if (sortKey === "category") return a.category.localeCompare(b.category);
      return a.location.area.localeCompare(b.location.area);
    });
  }, [needs, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  function header(label: string, key: SortKey) {
    return (
      <button
        type="button"
        onClick={() => {
          setSortKey(key);
          setPage(1);
        }}
        className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-ink/60"
      >
        {label}
        <ArrowDownUp className={cn("h-3.5 w-3.5", sortKey === key && "text-leaf")} aria-hidden />
      </button>
    );
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-ink/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Priority Needs</h2>
          <p className="text-sm text-ink/60">Paginated at 20 records with urgency-first sorting.</p>
        </div>
        <span className="rounded-md bg-mint px-3 py-1 text-sm font-medium text-leaf">{needs.length} tracked</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink/10">
          <thead className="bg-paper">
            <tr>
              <th scope="col" className="px-5 py-3 text-left">{header("Need", "location")}</th>
              <th scope="col" className="px-5 py-3 text-left">{header("Urgency", "urgency_score")}</th>
              <th scope="col" className="px-5 py-3 text-left">{header("Category", "category")}</th>
              <th scope="col" className="px-5 py-3 text-left">{header("Affected", "estimated_affected")}</th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/60">Skills</th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/60">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 bg-white">
            {pageRows.map((need) => (
              <tr key={need.id} className="align-top hover:bg-mint/35">
                <td className="max-w-md px-5 py-4">
                  <p className="font-semibold text-ink">{need.title}</p>
                  <p className="mt-1 text-sm text-ink/65">{need.location.area}, {need.location.pincode}</p>
                  <p className="mt-2 text-sm text-ink/70">{need.description}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-sm font-semibold ring-1 ${urgencyTone(need.urgency_score)}`}>
                    {urgencyLabel(need.urgency_score)} {need.urgency_score}/10
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-ink/75">{categoryLabel(need.category)}</td>
                <td className="px-5 py-4 text-sm font-semibold text-ink">{formatNumber(need.estimated_affected)}</td>
                <td className="px-5 py-4">
                  <div className="flex max-w-xs flex-wrap gap-1.5">
                    {need.skills_needed.map((skill) => (
                      <span key={skill} className="rounded-md bg-paper px-2 py-1 text-xs font-medium text-ink/70">
                        {skill.replaceAll("_", " ")}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm capitalize text-ink/70">{need.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-ink/10 px-5 py-4">
        <p className="text-sm text-ink/60">Page {page} of {pageCount}</p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-md border border-ink/10 p-2 text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={page === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            className="rounded-md border border-ink/10 p-2 text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
