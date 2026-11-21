import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "./fileLock.js";

const dataDir = path.resolve(process.cwd(), process.env.WORKSHOPS_DATA_DIR ?? "data");
const dataFile = path.join(dataDir, "workshops.json");

export async function readWorkshops() {
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
    throw new Error("Workshop storage is corrupt");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Workshop storage is corrupt");
  }
  return parsed;
}

function writeAll(workshops) {
  return (async () => {
    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(workshops, null, 2), "utf8");
    await rename(tempFile, dataFile);
  })();
}

export function saveWorkshop(values) {
  return withFileLock(dataFile, async () => {
    const workshops = await readWorkshops();
    const now = new Date().toISOString();
    const entry = {
      id: randomUUID(),
      ...values,
      createdAt: now,
      updatedAt: now,
    };
    workshops.push(entry);
    await writeAll(workshops);
    return entry;
  });
}

export function updateWorkshop(id, patchValues) {
  return withFileLock(dataFile, async () => {
    const workshops = await readWorkshops();
    const index = workshops.findIndex((workshop) => workshop.id === id);
    if (index === -1) {
      return null;
    }
    const entry = {
      ...workshops[index],
      ...patchValues,
      updatedAt: new Date().toISOString(),
    };
    workshops[index] = entry;
    await writeAll(workshops);
    return entry;
  });
}

export function deleteWorkshop(id) {
  return withFileLock(dataFile, async () => {
    const workshops = await readWorkshops();
    const remaining = workshops.filter((workshop) => workshop.id !== id);
    if (remaining.length === workshops.length) {
      return false;
    }
    await writeAll(remaining);
    return true;
  });
}
