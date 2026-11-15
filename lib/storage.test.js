import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

let runCounter = 0;

async function loadFresh(moduleName, env) {
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }
  runCounter += 1;
  return import(`./${moduleName}?run=${runCounter}`);
}

test("10 simultaneous blog saves keep all posts with unique IDs and slugs", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "blog-lock-"));
  try {
    const { saveBlog, readBlogs } = await loadFresh("blogs.js", {
      BLOG_DATA_DIR: dir,
    });

    const entries = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        saveBlog({
          title: `Concurrent post ${i}`,
          description: `desc ${i}`,
          content: `body ${i}`,
        })
      )
    );

    const stored = JSON.parse(await readFile(path.join(dir, "blogs.json"), "utf8"));
    assert.equal(stored.length, 10);
    assert.equal(new Set(entries.map((e) => e.id)).size, 10);
    assert.equal(new Set(stored.map((e) => e.slug)).size, 10);
    assert.equal((await readBlogs()).length, 10);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("10 simultaneous contact saves keep all messages with unique IDs", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "contact-lock-"));
  try {
    const { saveSubmission, readSubmissions } = await loadFresh("submissions.js", {
      CONTACT_DATA_DIR: dir,
    });

    const entries = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        saveSubmission({
          name: `Person ${i}`,
          email: `person${i}@example.com`,
          message: `message ${i}`,
          source: "test",
        })
      )
    );

    const stored = JSON.parse(
      await readFile(path.join(dir, "contact-submissions.json"), "utf8")
    );
    assert.equal(stored.length, 10);
    assert.equal(new Set(entries.map((e) => e.id)).size, 10);
    assert.equal((await readSubmissions()).length, 10);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("damaged blog storage is preserved and reported, not overwritten", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "blog-damage-"));
  try {
    const damaged = '[{"id":"keep-me","slug":"kept","title":"Kept post"}';
    await writeFile(path.join(dir, "blogs.json"), damaged, "utf8");
    const { saveBlog, readBlogs } = await loadFresh("blogs.js", {
      BLOG_DATA_DIR: dir,
    });

    await assert.rejects(() => readBlogs(), /corrupt/i);
    await assert.rejects(
      () => saveBlog({ title: "New", description: "d", content: "c" }),
      /corrupt/i
    );
    assert.equal(await readFile(path.join(dir, "blogs.json"), "utf8"), damaged);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("damaged contact storage is preserved and reported, not overwritten", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "contact-damage-"));
  try {
    const damaged = '[{"id":"keep-me","name":"Kept"';
    await writeFile(path.join(dir, "contact-submissions.json"), damaged, "utf8");
    const { saveSubmission, readSubmissions } = await loadFresh("submissions.js", {
      CONTACT_DATA_DIR: dir,
    });

    await assert.rejects(() => readSubmissions(), /corrupt/i);
    await assert.rejects(
      () => saveSubmission({ name: "New", email: "n@e.com", message: "m", source: "test" }),
      /corrupt/i
    );
    assert.equal(
      await readFile(path.join(dir, "contact-submissions.json"), "utf8"),
      damaged
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a missing blog or contact file still starts as an empty list", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "fresh-store-"));
  try {
    const { readBlogs } = await loadFresh("blogs.js", { BLOG_DATA_DIR: dir });
    const { readSubmissions } = await loadFresh("submissions.js", {
      CONTACT_DATA_DIR: dir,
    });
    assert.deepEqual(await readBlogs(), []);
    assert.deepEqual(await readSubmissions(), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
