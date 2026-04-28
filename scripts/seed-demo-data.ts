import fs from "node:fs";
import path from "node:path";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { assignments, fieldReports, needs, organizations, surveyUploads, volunteers } from "../lib/data";

const seedData = {
  organizations,
  needs,
  volunteers,
  assignments,
  survey_uploads: surveyUploads,
  field_reports: fieldReports
};

function loadEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key] ??= rest.join("=");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!getApps().length) {
  initializeApp({
    credential: projectId && clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
    projectId
  });
}

const db = getFirestore();

async function seedCollection<T extends { id: string }>(collectionName: string, rows: T[]) {
  const batch = db.batch();
  rows.forEach((row) => {
    const { id, ...data } = row;
    batch.set(db.collection(collectionName).doc(id), data, { merge: true });
  });
  await batch.commit();
  console.log(`Seeded ${rows.length} ${collectionName}`);
}

async function main() {
  await seedCollection("organizations", organizations);
  await seedCollection("needs", needs);
  await seedCollection("volunteers", volunteers);
  await seedCollection("assignments", assignments);
  await seedCollection("survey_uploads", surveyUploads);
  await seedCollection("field_reports", fieldReports);
  console.log("SevaSetu demo data is ready.");
}

main().catch((error) => {
  const previewPath = path.join(process.cwd(), "scripts", "demo-seed-preview.json");
  fs.writeFileSync(previewPath, JSON.stringify(seedData, null, 2));
  console.warn("Firestore seed skipped because Firebase Admin credentials are not available.");
  console.warn("Add FIREBASE_ADMIN_* values to .env.local to write these records into Firestore.");
  console.warn(`Wrote a local seed preview instead: ${previewPath}`);
});
