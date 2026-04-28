import fs from "node:fs";
import path from "node:path";

const generatedTypes = path.join(process.cwd(), ".next", "types");

if (fs.existsSync(generatedTypes)) {
  fs.rmSync(generatedTypes, { recursive: true, force: true });
}
