import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "./fileLock.js";

const dataDir = path.resolve(process.cwd(), process.env.CONTACT_DATA_DIR ?? "data");
const dataFile = path.join(dataDir, "contact-submissions.json");

export async function readSubmissions() {
  let raw;
  try {
    raw = await readFile(dataFile, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Contact storage is corrupt");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Contact storage is corrupt");
  }
  return parsed;
}

export function saveSubmission({ name, email, message, source }) {
  return withFileLock(dataFile, async () => {
    const submissions = await readSubmissions();

    const entry = {
      id: randomUUID(),
      name: name.trim(),
      email,
      message: message.trim(),
      submitted: new Date().toISOString(),
      source,
    };

    submissions.push(entry);

    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(submissions, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return entry;
  });
}
