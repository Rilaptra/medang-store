import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __srcDir = path.join(__dirname, "..", "..", "..");
const modelsDir = path.join(__srcDir, "src", "lib", "db", "models");

export async function initModels() {
  const files = fs.readdirSync(modelsDir);

  for (const file of files) {
    if (file.endsWith(".model.ts")) {
      try {
        await import(`@/lib/db/models/${file}`);
      } catch (error) {
        console.error(`Failed to import model ${file}`, error);
      }
    }
  }
}
