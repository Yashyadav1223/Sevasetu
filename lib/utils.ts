import type { Need, NeedCategory, Volunteer } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function urgencyLabel(score: number) {
  if (score >= 8) return "Critical";
  if (score >= 5) return "Moderate";
  return "Stable";
}

export function urgencyTone(score: number) {
  if (score >= 8) return "bg-rose/10 text-rose ring-rose/20";
  if (score >= 5) return "bg-saffron/15 text-[#8a530f] ring-saffron/30";
  return "bg-leaf/10 text-leaf ring-leaf/20";
}

export function categoryLabel(category: NeedCategory) {
  return category
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

export function deterministicMatchScore(need: Need, volunteer: Volunteer) {
  const skillMatches = need.skills_needed.filter((skill) =>
    volunteer.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  ).length;
  const skillScore = Math.min(45, skillMatches * 18);
  const distance = haversineKm(need.location, volunteer.location);
  const proximityScore = Math.max(0, 25 - distance * 2.5);
  const availabilityScore = Math.min(15, volunteer.availability.hours_per_week * 0.6);
  const performanceScore = Math.min(15, volunteer.performance_score * 1.5);

  return Math.round(Math.min(100, skillScore + proximityScore + availabilityScore + performanceScore));
}

export function explainFallbackMatch(need: Need, volunteer: Volunteer) {
  const distance = haversineKm(need.location, volunteer.location);
  const matchedSkills = need.skills_needed.filter((skill) =>
    volunteer.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );
  const skills = matchedSkills.length ? matchedSkills.join(", ") : volunteer.skills.slice(0, 2).join(", ");
  return `${volunteer.name} matched because they bring ${skills}, can offer ${volunteer.availability.hours_per_week} hours weekly, and are about ${Math.max(1, Math.round(distance))} km from ${need.location.area}.`;
}

export function statusTone(status: string) {
  if (status === "resolved" || status === "completed") return "bg-leaf/10 text-leaf";
  if (status === "assigned" || status === "accepted") return "bg-river/10 text-river";
  if (status === "declined") return "bg-rose/10 text-rose";
  return "bg-saffron/15 text-[#8a530f]";
}
