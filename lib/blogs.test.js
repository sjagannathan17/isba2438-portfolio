import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.BLOG_DATA_DIR = mkdtempSync(join(tmpdir(), "blogs-test-"));

const { saveBlog, updateBlog, deleteBlog, findBlogById, readBlogs } = await import(
  "./blogs.js"
);
const { blogFieldErrors } = await import("./validateBlog.js");

test("create, update preserving id and createdAt, delete", async () => {
  const created = await saveBlog({
    title: "Unit Test Post",
    description: "First description.",
    content: "Hello world.",
  });
  assert.equal(created.slug, "unit-test-post");
  assert.ok(created.createdAt);

  const later = new Date(Date.now() + 50).toISOString();
  const result = await updateBlog(created.id, {
    title: "Unit Test Post Renamed",
    description: "Second description.",
  });
  assert.equal(result.updated.id, created.id);
  assert.equal(result.updated.createdAt, created.createdAt);
  assert.ok(result.updated.updatedAt);
  assert.equal(result.updated.slug, "unit-test-post");
  assert.equal(result.updated.description, "Second description.");
  assert.equal(result.updated.content, "Hello world.");

  const found = await findBlogById(created.id);
  assert.equal(found.title, "Unit Test Post Renamed");
  assert.equal((await readBlogs()).length, 1);

  assert.equal(await deleteBlog(created.id), true);
  assert.equal(await deleteBlog(created.id), false);
  assert.equal(await findBlogById(created.id), null);
  assert.equal((await readBlogs()).length, 0);
});

test("renaming a post keeps its slug, so addresses stay stable", async () => {
  const a = await saveBlog({
    title: "Shared Address",
    description: "A.",
    content: "A.",
  });
  const b = await saveBlog({
    title: "Different Title",
    description: "B.",
    content: "B.",
  });
  const result = await updateBlog(b.id, { title: "Shared Address" });
  assert.equal(result.updated.slug, "different-title");
  assert.equal(result.updated.title, "Shared Address");
  await deleteBlog(a.id);
  await deleteBlog(b.id);
});

test("editing without changing the title keeps the exact slug", async () => {
  const post = await saveBlog({
    title: "Keep My Slug",
    description: "D.",
    content: "D.",
  });
  const result = await updateBlog(post.id, { content: "New content." });
  assert.equal(result.updated.slug, post.slug);
  await deleteBlog(post.id);
});

test("unknown update fields are reported", () => {
  const errors = blogFieldErrors({ title: "x", slug: "hack", id: "1" });
  assert.equal(errors.slug, "This field is not supported.");
  assert.equal(errors.id, "This field is not supported.");
  assert.equal(errors.title, undefined);
});
