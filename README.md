# SevaSetu

## Project Overview

SevaSetu is a data-driven volunteer coordination platform for Indian NGOs and local social groups. It turns fragmented surveys, field notes, PDFs, and volunteer profiles into AI-ranked needs, explainable volunteer matches, offline field reports, and impact analytics.

## Why It Matters

Small NGOs often collect urgent community needs through paper surveys, WhatsApp messages, notebooks, and spreadsheet fragments. SevaSetu helps coordinators see which needs are most urgent, where volunteers are available, and why a volunteer is a good fit for a task.

Aligned SDGs:

- SDG 1: No Poverty, by improving response to food, health, and livelihood-linked needs.
- SDG 10: Reduced Inequalities, by surfacing underserved communities and coverage gaps.
- SDG 17: Partnerships, by coordinating NGOs, volunteers, field workers, and donors.

## Architecture

```text
Mobile/Web PWA (Next.js App Router + Tailwind)
        |
        | Firebase Auth custom claims: ngo_admin, volunteer, field_worker
        v
Next.js API Routes
        |
        |-- /api/survey/process ------ Gemini 1.5 Pro survey extraction
        |-- /api/matching ------------ Gemini volunteer-task ranking
        |-- /api/impact-report ------- Gemini weekly report generation
        |-- /api/urgency-rescore ----- 24h cron urgency re-scoring fallback
        |-- /api/field-report -------- Offline-friendly field submissions
        |
        v
Firebase
  |-- Firestore: organizations, needs, volunteers, assignments, uploads, reports
  |-- Optional Storage: survey files, photos, voice notes when Blaze is available
  |-- Security Rules: role and org scoped access
  |-- Hosting: deployable PWA
  |-- Firebase Cloud Functions: new-need matching and scheduled urgency rescoring
        |
        v
Leaflet.js + OpenStreetMap for interactive need and volunteer coverage maps (no billing, no API key required)
```

## Google Technologies Used

- Gemini 1.5 Pro for survey intelligence, matching, impact reporting, and urgency rescoring.
- Firebase Firestore for scalable real-time operational data.
- Firebase Authentication for role-based sign-in.
- Firebase Auth and Firestore on the Spark plan for identity and structured data.
- Firebase Storage is optional for production file evidence and requires Blaze for new Firebase projects.
- Firebase Hosting-ready configuration.
- Firebase Cloud Functions are optional for async production workflows and require Blaze; Vercel API routes provide the no-Blaze demo path.

## Key Features

- NGO dashboard with open needs, active volunteers, resolved needs, average response time, priority table, map, AI insights, and survey upload.
- Survey Intelligence Engine for CSV, PDF, plain text, and manual survey input.
- AI volunteer matching with top-three recommendations and human-readable explanations.
- Volunteer portal with matched tasks, accept/decline/complete actions, impact score, hours, and history.
- Mobile-first field reporting with GPS, photo evidence, manual pincode, urgency, and offline queue.
- Analytics for submitted vs resolved needs, categories, unmet-need heatmap, and leaderboard.
- Interactive Leaflet map with color-coded urgency pins, volunteer locations, and click-to-view need details. No map API key required.
- Accessible UI meeting WCAG 2.1 AA standards with full keyboard navigation, aria-labels, and sufficient color contrast ratios.
- Firestore rules that prevent volunteers from seeing other volunteers' personal data and restrict NGO dashboards to org admins.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` values into `.env.local` and add real keys:

   ```text
   GEMINI_API_KEY=...
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   FIREBASE_ADMIN_PROJECT_ID=...
   FIREBASE_ADMIN_CLIENT_EMAIL=...
   FIREBASE_ADMIN_PRIVATE_KEY=...
   CRON_SECRET=...
   ```

3. Run locally:

   ```bash
   npm run dev
   ```

4. Seed Firestore demo data when Firebase Admin credentials are present:

   ```bash
   npm run seed
   ```

5. Run validation:

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

6. Optional production-only step: deploy async Firebase functions after setting the Gemini secret. Skip this if you are staying on the Spark plan.

   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   cd functions && npm install && npm run build
   ```

## Gemini Prompt Engineering

All Gemini calls live in `lib/gemini.ts`. The layer includes retries, JSON-only prompts, Zod validation, Firestore response caching, and deterministic fallbacks. This keeps demos resilient even if the API key is missing or a model response is malformed.

Implemented AI flows:

- Survey extraction: structures location, category, affected people, urgency, and skills.
- Deduplication: clusters repeated survey mentions across uploads.
- Matching: ranks top three volunteers by skill fit, proximity, availability, and past performance.
- Impact reports: summarizes weekly outcomes in non-technical NGO language.
- Urgency rescoring: cron-compatible endpoint updates open needs using elapsed time and seasonal risk.

## Security Model

Firestore rules use Firebase custom claims:

- `role`: `ngo_admin`, `volunteer`, or `field_worker`
- `orgId`: the organization a user belongs to

Rules enforce:

- NGO admins can read and manage their own org dashboard data.
- Volunteers can read and update only their own profile and assignments.
- Field workers can create reports for their organization.
- Gemini cache documents are server-only.

## Offline Support

The field report form registers `public/sw.js`. Failed report submissions are queued with IndexedDB in the service worker and localStorage in the UI fallback, then synced when the network returns.

## Deployment Notes

- For Vercel, deploy the Next.js app directly and keep Firebase Spark services for Auth and Firestore.
- For Firebase Hosting, use the included `firebase.json`, Firestore rules, Storage rules, and indexes.
- Prefer `functions/src/index.ts` for production scheduled urgency rescoring. `/api/urgency-rescore` is kept as a Vercel-compatible fallback and should be protected with `x-cron-secret`.
- A Next.js 16 upgrade is recommended before public production deployment for latest security patches.

## No-Blaze Hackathon Mode

For Google Solution Challenge submission, SevaSetu can run without the Firebase Blaze plan. Use Firebase Authentication and Firestore on Spark, deploy the Next.js app on Vercel, and use the included API routes for Gemini survey extraction, volunteer matching, impact reports, and field report capture. File/photo persistence through Firebase Storage and background Firebase Cloud Functions are production extensions, not required for the demo video.

## Demo Scope

The app ships with realistic Indian demo data for Mumbai, rural Bihar, and Chennai so judges can evaluate the product without provisioning Firebase. When credentials are added, the same service layer can write to Firestore and use Gemini live.
