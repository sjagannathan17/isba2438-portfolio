import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "./fileLock.js";

const dataDir = path.resolve(process.cwd(), process.env.PROJECT_DATA_DIR ?? "data");
const dataFile = path.join(dataDir, "projects.json");

export async function readProjects() {
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
    throw new Error("Project storage is corrupt");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Project storage is corrupt");
  }
  return parsed;
}

export async function getProjectBySlug(slug) {
  const projects = await readProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function findProjectById(id) {
  const projects = await readProjects();
  return projects.find((project) => project.id === id) ?? null;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function saveProject(values) {
  return withFileLock(dataFile, async () => {
    const projects = await readProjects();

    const base = slugify(values.name) || "project";
    let slug = base;
    let n = 2;
    while (projects.some((project) => project.slug === slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }

    const entry = {
      id: randomUUID(),
      slug,
      createdAt: new Date().toISOString(),
      ...values,
    };

    projects.push(entry);

    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(projects, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return entry;
  });
}

export function updateProject(id, updates) {
  return withFileLock(dataFile, async () => {
    const projects = await readProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) {
      return null;
    }

    const entry = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = entry;

    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(projects, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return entry;
  });
}

export async function deleteProject(id) {
  return withFileLock(dataFile, async () => {
    const projects = await readProjects();
    const remaining = projects.filter((project) => project.id !== id);
    if (remaining.length === projects.length) {
      return false;
    }
    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(remaining, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return true;
  });
}
