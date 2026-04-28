"use client";

import { useRef, useState } from "react";
import { FileUp, Sparkles, Wand2 } from "lucide-react";
import type { SurveyProcessingResult } from "@/types";
import { LoadingBlock } from "@/components/LoadingBlock";
import { categoryLabel, urgencyTone } from "@/lib/utils";

const sampleSurvey = `area,pincode,issue,people,frequency
Saki Naka,400072,fever and mosquito breeding near blocked drains,340,high
Malad East,400097,missed child immunisation appointments,72,medium
Dharavi Sector 5,400017,children need notebooks and bridge learning,86,medium`;

export function SurveyUpload() {
  const [rawText, setRawText] = useState(sampleSurvey);
  const [result, setResult] = useState<SurveyProcessingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function processSurvey() {
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      const file = fileRef.current?.files?.[0];
      if (file) formData.append("file", file);
      formData.append("text", rawText);

      const response = await fetch("/api/survey/process", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Survey processing failed.");
      setResult((await response.json()) as SurveyProcessingResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process survey.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-ink/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Upload Survey</h2>
          <p className="text-sm text-ink/60">CSV, PDF, plain text, or pasted field notes become structured needs.</p>
        </div>
        <button
          type="button"
          onClick={processSurvey}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Wand2 className="h-4 w-4" aria-hidden />
          {loading ? "Processing" : "Run Gemini Engine"}
        </button>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Survey file</span>
            <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink/20 bg-paper px-4 py-5 text-center text-sm text-ink/65">
              <FileUp className="mb-2 h-6 w-6 text-leaf" aria-hidden />
              Add a CSV, PDF, or text file
              <input ref={fileRef} type="file" accept=".csv,.txt,.pdf,text/plain,text/csv,application/pdf" className="sr-only" />
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">Raw survey text</span>
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              rows={9}
              className="mt-2 w-full rounded-md border border-ink/15 bg-white p-3 text-sm text-ink shadow-sm"
            />
          </label>
          {error && <p className="rounded-md bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>}
        </div>

        <div>
          {loading && <LoadingBlock label="Gemini survey processing" />}
          {!loading && !result && (
            <div className="rounded-lg border border-ink/10 bg-mint/45 p-5">
              <Sparkles className="h-6 w-6 text-leaf" aria-hidden />
              <h3 className="mt-3 font-semibold text-ink">Survey Intelligence Engine</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                Gemini extracts needs, estimates urgency, clusters duplicate reports, and writes a coordinator-ready summary. If Gemini is unavailable, SevaSetu keeps working with a deterministic fallback parser.
              </p>
            </div>
          )}
          {!loading && result && (
            <div className="space-y-4">
              <div className="rounded-lg border border-ink/10 bg-paper p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-ink">AI Summary</h3>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold uppercase text-leaf">{result.source}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/72">{result.summary}</p>
              </div>
              <div className="space-y-3">
                {result.dedupedNeeds.map((need, index) => (
                  <article key={`${need.location}-${index}`} className="rounded-lg border border-ink/10 bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${urgencyTone(need.urgency_score)}`}>
                        Urgency {need.urgency_score}/10
                      </span>
                      <span className="rounded-md bg-paper px-2 py-1 text-xs font-semibold text-ink/70">{categoryLabel(need.category)}</span>
                    </div>
                    <h4 className="mt-3 font-semibold text-ink">{need.location}</h4>
                    <p className="mt-1 text-sm text-ink/70">{need.description}</p>
                    <p className="mt-2 text-xs font-medium text-ink/55">{need.estimated_people_affected} people affected</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
