import assert from "node:assert/strict";
import { test } from "node:test";
import { validateBlog, slugify } from "./validateBlog.js";

test("valid post passes with no errors", () => {
  const result = validateBlog({
    title: "A post",
    description: "A short description",
    content: "Some content",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("blank or whitespace-only fields fail", () => {
  for (const field of ["title", "description", "content"]) {
    assert.ok(validateBlog({ title: "A", description: "B", content: "C", [field]: "" }).errors[field]);
    assert.ok(validateBlog({ title: "A", description: "B", content: "C", [field]: "   " }).errors[field]);
  }
});

test("non-string fields fail with a clear message", () => {
  const result = validateBlog({ title: 123, description: null, content: ["x"] });
  assert.equal(result.valid, false);
  assert.match(result.errors.title, /must be text/);
  assert.match(result.errors.description, /must be text/);
  assert.match(result.errors.content, /must be text/);
});

test("missing fields fail like empty ones", () => {
  const result = validateBlog({});
  assert.equal(result.valid, false);
  assert.ok(result.errors.title && result.errors.description && result.errors.content);
});

test("slugify produces url-safe slugs", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("  Notes on RAG  "), "notes-on-rag");
  assert.equal(slugify("Multiple   spaces & symbols??"), "multiple-spaces-symbols");
});
