"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";

const skills = ["medical", "teaching", "construction", "logistics", "counselling", "food_distribution", "digital_literacy"];

export function VolunteerRegistration() {
  const [selected, setSelected] = useState<string[]>(["medical", "public_health"]);
  const [saved, setSaved] = useState(false);

  function toggle(skill: string) {
    setSelected((current) => (current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]));
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Volunteer Registration</h2>
      <p className="mt-1 text-sm text-ink/60">The same profile feeds the AI matching prompt.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Name</span>
          <input className="mt-2 w-full rounded-md border border-ink/15 p-3 text-sm" defaultValue="Ravi Menon" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Pincode</span>
          <input className="mt-2 w-full rounded-md border border-ink/15 p-3 text-sm" defaultValue="400069" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Available days</span>
          <input className="mt-2 w-full rounded-md border border-ink/15 p-3 text-sm" defaultValue="Saturday, Sunday" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Hours per week</span>
          <input type="number" className="mt-2 w-full rounded-md border border-ink/15 p-3 text-sm" defaultValue={8} />
        </label>
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold text-ink">Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold ${
                selected.includes(skill) ? "bg-leaf text-white" : "bg-paper text-ink"
              }`}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {skill.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSaved(true)}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
      >
        <Save className="h-4 w-4" aria-hidden />
        Save Profile
      </button>
      {saved && <p className="mt-3 rounded-md bg-mint px-3 py-2 text-sm font-semibold text-leaf">Profile saved for demo matching.</p>}
    </section>
  );
}
