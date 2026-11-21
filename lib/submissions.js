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

export function saveSubmission({ name, email, message, source, company, role }) {
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
    if (company !== undefined) {
      entry.company = company;
    }
    if (role !== undefined) {
      entry.role = role;
    }

    submissions.push(entry);

    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(submissions, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return entry;
  });
}

export function updateSubmission(id, values) {
  return withFileLock(dataFile, async () => {
    const submissions = await readSubmissions();
    const index = submissions.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return null;
    }
    const entry = { ...submissions[index], ...values };
    submissions[index] = entry;
    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(submissions, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return entry;
  });
}

export function deleteSubmission(id) {
  return withFileLock(dataFile, async () => {
    const submissions = await readSubmissions();
    const remaining = submissions.filter((entry) => entry.id !== id);
    if (remaining.length === submissions.length) {
      return false;
    }
    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(remaining, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return true;
  });
}
