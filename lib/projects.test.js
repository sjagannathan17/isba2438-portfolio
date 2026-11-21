import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const seed = [
  {
    id: "seed-1",
    slug: "kept-project",
    name: "Kept Project",
    image: "/projects/flex.png",
    imageAlt: "alt text",
    relatedPins: ["santa-clara"],
    coords: "37.35° N, 121.96° W",
    place: "Santa Clara, CA",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const dir = mkdtempSync(join(tmpdir(), "projects-test-"));
process.env.PROJECT_DATA_DIR = dir;
writeFileSync(join(dir, "projects.json"), JSON.stringify(seed, null, 2));

const {
  readProjects,
  saveProject,
  updateProject,
  deleteProject,
  findProjectById,
  getProjectBySlug,
} = await import("./projects.js");

test("existing records are read with every field preserved", async () => {
  const projects = await readProjects();
  assert.equal(projects.length, 1);
  assert.equal(projects[0].image, "/projects/flex.png");
  assert.equal(projects[0].place, "Santa Clara, CA");
  assert.equal(projects[0].slug, "kept-project");
  assert.equal((await getProjectBySlug("kept-project")).id, "seed-1");
  assert.equal(await getProjectBySlug("missing"), null);
});

test("create assigns id, slug, createdAt and keeps them on update", async () => {
  const created = await saveProject({
    name: "New Project",
    tag: "T",
    context: "C",
    year: "2026",
    timeframe: "TF",
    roleSummary: "R",
    blurb: "B",
    summary: "S",
    why: "W",
    contribution: "X",
    impact: "I",
    tech: ["Python"],
    link: { label: "L", url: "https://example.com/repo" },
  });
  assert.equal(created.slug, "new-project");
  assert.ok(created.id);
  assert.ok(created.createdAt);

  const result = await updateProject(created.id, { name: "Renamed Project", impact: "Better." });
  assert.equal(result.id, created.id);
  assert.equal(result.slug, "new-project");
  assert.equal(result.createdAt, created.createdAt);
  assert.ok(result.updatedAt);
  assert.equal(result.impact, "Better.");
  assert.equal(result.image, undefined);
  assert.equal((await getProjectBySlug("kept-project")) != null, true);
  assert.equal((await getProjectBySlug("new-project")).id, created.id);

  assert.equal(await deleteProject(created.id), true);
  assert.equal(await findProjectById(created.id), null);
  assert.equal((await readProjects()).length, 1);
});
