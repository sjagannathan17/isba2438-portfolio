import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "./validateBlog.js";
import { withFileLock } from "./fileLock.js";

const dataDir = path.resolve(process.cwd(), process.env.BLOG_DATA_DIR ?? "data");
const dataFile = path.join(dataDir, "blogs.json");

export async function readBlogs() {
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
    throw new Error("Blog storage is corrupt");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Blog storage is corrupt");
  }
  return parsed;
}

export function saveBlog({ title, description, content }) {
  return withFileLock(dataFile, async () => {
    let posts;
    try {
      posts = await readBlogs();
    } catch {
      throw new Error("Blog storage is corrupt");
    }

    const base = slugify(title) || "post";
    let slug = base;
    let n = 2;
    while (posts.some((post) => post.slug === slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }

    const entry = {
      id: randomUUID(),
      slug,
      title: title.trim(),
      description: description.trim(),
      content,
      createdAt: new Date().toISOString(),
    };

    posts.push(entry);

    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(posts, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return entry;
  });
}

export async function findBlogById(id) {
  const posts = await readBlogs();
  return posts.find((post) => post.id === id) ?? null;
}

export function updateBlog(id, values) {
  return withFileLock(dataFile, async () => {
    const posts = await readBlogs();
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return { updated: null };
    }

    const existing = posts[index];

    const entry = {
      ...existing,
      slug: existing.slug,
      title: values.title !== undefined ? values.title.trim() : existing.title,
      description:
        values.description !== undefined
          ? values.description.trim()
          : existing.description,
      content: values.content !== undefined ? values.content : existing.content,
      updatedAt: new Date().toISOString(),
    };

    posts[index] = entry;

    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(posts, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return { updated: entry };
  });
}

export async function deleteBlog(id) {
  return withFileLock(dataFile, async () => {
    const posts = await readBlogs();
    const remaining = posts.filter((post) => post.id !== id);
    if (remaining.length === posts.length) {
      return false;
    }
    await mkdir(dataDir, { recursive: true });
    const tempFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(tempFile, JSON.stringify(remaining, null, 2), "utf8");
    await rename(tempFile, dataFile);
    return true;
  });
}
