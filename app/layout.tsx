import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { PwaBoot } from "@/components/PwaBoot";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SevaSetu | AI Volunteer Coordination",
  description: "Data-driven volunteer coordination platform for NGOs and local social groups in India.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f7a5f"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <PwaBoot />
        {children}
      </body>
    </html>
  );
}
