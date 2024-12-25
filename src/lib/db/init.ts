import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, "models");

export async function initModels() {
  const files = fs.readdirSync(modelsDir);

  for (const file of files) {
    if (file.endsWith(".model.ts")) {
      await import(`@/lib/db/models/${file}`);
    }
  }
}
