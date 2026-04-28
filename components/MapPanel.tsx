"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Need, Volunteer } from "@/types";

export function MapPanel({ needs, volunteers }: { needs: Need[]; volunteers: Volunteer[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const center = useMemo(() => {
    const points = needs.map((need) => need.location);
    const lat = points.reduce((sum, point) => sum + point.lat, 0) / Math.max(1, points.length);
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / Math.max(1, points.length);
    return { lat, lng };
  }, [needs]);

  useEffect(() => {
    if (!mapRef.current) return;

    let isMounted = true;
    let cleanup = () => {};

    async function createMap() {
      const L = await import("leaflet");
      if (!isMounted || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 11,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const makeNeedIcon = (need: Need) => {
        const color = need.status === "resolved" ? "#0f7a5f" : need.urgency_score >= 8 ? "#c6415d" : "#f2a13b";
        return L.divIcon({
          className: "sevasetu-leaflet-marker",
          html: `<span style="background:${color}" aria-hidden="true"></span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        });
      };

      const volunteerIcon = L.divIcon({
        className: "sevasetu-leaflet-marker sevasetu-leaflet-marker-volunteer",
        html: `<span aria-hidden="true"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -9]
      });

      needs.slice(0, 50).forEach((need) => {
        L.marker([need.location.lat, need.location.lng], {
          icon: makeNeedIcon(need),
          title: need.title,
          alt: `${need.title} at ${need.location.area}`
        })
          .addTo(map)
          .bindPopup(
            `<strong>${need.title}</strong><br/>${need.location.area}, ${need.location.pincode}<br/>Urgency ${need.urgency_score}/10<br/>${need.status}`
          );
      });

      volunteers.slice(0, 50).forEach((volunteer) => {
        L.marker([volunteer.location.lat, volunteer.location.lng], {
          icon: volunteerIcon,
          title: volunteer.name,
          alt: `Volunteer ${volunteer.name} near ${volunteer.location.area}`
        })
          .addTo(map)
          .bindPopup(`<strong>${volunteer.name}</strong><br/>${volunteer.location.area}<br/>${volunteer.skills.slice(0, 3).join(", ")}`);
      });

      const bounds = L.latLngBounds([
        ...needs.map((need) => [need.location.lat, need.location.lng] as [number, number]),
        ...volunteers.map((volunteer) => [volunteer.location.lat, volunteer.location.lng] as [number, number])
      ]);
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.18), { maxZoom: 12 });

      cleanup = () => map.remove();
    }

    createMap();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [center, needs, volunteers]);

  return (
    <section className="rounded-lg border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 p-5">
        <div>
          <h2 className="text-lg font-semibold text-ink">Needs vs Volunteers Map</h2>
          <p className="text-sm text-ink/60">Leaflet / OpenStreetMap coverage with no API key required.</p>
        </div>
        <div className="hidden gap-2 text-xs font-medium sm:flex">
          <span className="rounded-md bg-rose/10 px-2 py-1 text-rose">Critical</span>
          <span className="rounded-md bg-saffron/20 px-2 py-1 text-[#8a530f]">Moderate</span>
          <span className="rounded-md bg-leaf/10 px-2 py-1 text-leaf">Resolved</span>
        </div>
      </div>

      <div ref={mapRef} className="h-[430px] w-full rounded-b-lg" aria-label="Interactive map of community needs and volunteer locations" />
    </section>
  );
}
