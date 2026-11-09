import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "contact-submissions.json");

export async function readSubmissions() {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSubmission({ name, email, message, source }) {
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
  await writeFile(dataFile, JSON.stringify(submissions, null, 2), "utf8");
  return entry;
}
