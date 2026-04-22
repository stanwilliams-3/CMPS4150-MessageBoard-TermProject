import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Root folder for `.html` / static view files (`src/views`). */
export const VIEWS_DIR = path.join(__dirname, "..", "views");

const cache = new Map();

/** Read a file under `src/views` (cached). */
export function readView(relPath) {
  if (cache.has(relPath)) {
    return cache.get(relPath);
  }
  const full = path.join(VIEWS_DIR, relPath);
  const text = fs.readFileSync(full, "utf8");
  cache.set(relPath, text);
  return text;
}
