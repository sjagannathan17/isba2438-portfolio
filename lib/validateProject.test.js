import assert from "node:assert/strict";
import { test } from "node:test";
import { validateProject, projectFieldErrors } from "./validateProject.js";

const valid = {
  name: "Test Project",
  tag: "AI · Testing",
  context: "Course project",
  year: "2026",
  timeframe: "Fall 2026",
  roleSummary: "Builder",
  blurb: "A short blurb.",
  summary: "How it works.",
  why: "Why it matters.",
  contribution: "What I did.",
  impact: "What happened.",
  tech: ["Python", "Next.js"],
  link: { label: "View on GitHub", url: "https://github.com/example/test" },
};

test("a complete project passes with no errors", () => {
  const { valid: ok, errors } = validateProject(valid);
  assert.equal(ok, true);
  assert.deepEqual(errors, {});
});

test("missing or empty required fields are rejected", () => {
  const { valid: ok, errors } = validateProject({ ...valid, name: "  ", why: undefined });
  assert.equal(ok, false);
  assert.ok(errors.name);
  assert.ok(errors.why);
});

test("tech must be a non-empty array of non-empty strings", () => {
  assert.equal(validateProject({ ...valid, tech: [] }).valid, false);
  assert.equal(validateProject({ ...valid, tech: ["x", ""] }).valid, false);
  assert.equal(validateProject({ ...valid, tech: "Python" }).valid, false);
  assert.equal(validateProject({ ...valid, tech: ["Python"] }).valid, false === false);
});

test("link must include a label and an http(s) url", () => {
  assert.equal(validateProject({ ...valid, link: { label: "L", url: "ftp://x" } }).valid, false);
  assert.equal(validateProject({ ...valid, link: { label: "L", url: "notaurl" } }).valid, false);
  assert.equal(validateProject({ ...valid, link: { label: "", url: "https://x.com" } }).valid, false);
  assert.equal(validateProject({ ...valid, link: { label: "L", url: "https://x.com" } }).valid, true);
});

test("recognition is optional text", () => {
  assert.equal(validateProject({ ...valid, recognition: "Winner." }).valid, true);
  assert.equal(validateProject({ ...valid, recognition: 42 }).valid, false);
});

test("unsupported update fields are reported, slug included", () => {
  const errors = projectFieldErrors({ name: "x", slug: "new-slug", id: "1", image: "/x.png" });
  assert.ok(errors.slug);
  assert.ok(errors.id);
  assert.ok(errors.image);
  assert.equal(errors.name, undefined);
});
