"use client";

import { FormEvent, useState } from "react";
import { Camera, LocateFixed, Send, WifiOff } from "lucide-react";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { auth, firebaseConfigured } from "@/lib/firebase";

const emptyForm = {
  description: "",
  area: "",
  pincode: "",
  people: "25",
  urgency: "6"
};

export function FieldReportForm() {
  const [form, setForm] = useState(emptyForm);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { queuedCount, queueReport } = useOfflineQueue();

  function update(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function locate() {
    setStatus("Detecting location...");
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("GPS location attached.");
      },
      () => setStatus("Could not detect GPS. Manual pincode is enough.")
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const report = {
      orgId: "org-mumbai",
      submittedBy: "demo-field-worker",
      description: form.description,
      estimated_affected: Number(form.people),
      urgency: Number(form.urgency),
      photoUrls: photoNames,
      location: {
        area: form.area,
        pincode: form.pincode,
        lat: coords?.lat ?? 19.0726,
        lng: coords?.lng ?? 72.8845
      }
    };

    try {
      const token = firebaseConfigured ? await auth.currentUser?.getIdToken() : undefined;
      const response = await fetch("/api/field-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(report)
      });
      const data = (await response.json()) as { saved?: boolean; queued?: boolean };

      if (data.queued) {
        const registration = await navigator.serviceWorker?.ready;
        const syncRegistration = registration as ServiceWorkerRegistration & {
          sync?: { register: (tag: string) => Promise<void> };
        };
        await syncRegistration?.sync?.register("sync-field-reports");
        setStatus("Offline report saved on this device. It will sync when network returns.");
      } else {
        setStatus(data.saved ? "Report submitted to NGO dashboard." : "Report captured locally for demo mode.");
        setForm(emptyForm);
        setPhotoNames([]);
      }
    } catch {
      queueReport(report);
      setStatus("Network failed. Report saved locally and queued for sync.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Submit Field Report</h1>
          <p className="mt-1 text-sm text-ink/60">Designed for fast use on a 375px mobile screen.</p>
        </div>
        {queuedCount > 0 && (
          <span className="inline-flex items-center gap-2 rounded-md bg-saffron/20 px-3 py-1 text-sm font-semibold text-[#8a530f]">
            <WifiOff className="h-4 w-4" aria-hidden />
            {queuedCount} queued
          </span>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-ink">What is the problem?</span>
          <textarea
            required
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows={5}
            className="mt-2 w-full rounded-md border border-ink/15 p-3 text-base text-ink"
            placeholder="Example: Fever cases reported near blocked drain..."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Area</span>
            <input
              required
              value={form.area}
              onChange={(event) => update("area", event.target.value)}
              className="mt-2 w-full rounded-md border border-ink/15 p-3 text-base text-ink"
              placeholder="Area or village"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">Pincode</span>
            <input
              required
              inputMode="numeric"
              value={form.pincode}
              onChange={(event) => update("pincode", event.target.value)}
              className="mt-2 w-full rounded-md border border-ink/15 p-3 text-base text-ink"
              placeholder="400070"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-ink">People affected</span>
            <input
              type="number"
              min="1"
              value={form.people}
              onChange={(event) => update("people", event.target.value)}
              className="mt-2 w-full rounded-md border border-ink/15 p-3 text-base text-ink"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">Urgency: {form.urgency}/10</span>
            <input
              type="range"
              min="1"
              max="10"
              value={form.urgency}
              onChange={(event) => update("urgency", event.target.value)}
              className="mt-4 w-full accent-leaf"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink/20 bg-paper p-4 text-center text-sm font-medium text-ink/65">
            <Camera className="mb-2 h-5 w-5 text-leaf" aria-hidden />
            Upload photos
            <input
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={(event) => setPhotoNames(Array.from(event.target.files ?? []).map((file) => file.name))}
            />
          </label>
          <button
            type="button"
            onClick={locate}
            className="inline-flex min-h-24 items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white p-4 text-sm font-semibold text-ink"
          >
            <LocateFixed className="h-5 w-5 text-leaf" aria-hidden />
            Use GPS
          </button>
        </div>

        {photoNames.length > 0 && (
          <p className="rounded-md bg-mint px-3 py-2 text-sm text-leaf">{photoNames.length} photo evidence file(s) attached.</p>
        )}
        {status && <p className="rounded-md bg-paper px-3 py-2 text-sm text-ink/70">{status}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf px-4 py-3 text-base font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-5 w-5" aria-hidden />
          {submitting ? "Submitting" : "Submit Report"}
        </button>
      </div>
    </form>
  );
}
