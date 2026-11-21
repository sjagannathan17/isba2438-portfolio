import assert from "node:assert/strict";
import { test } from "node:test";
import { validateWorkshop, workshopFieldErrors } from "./validateWorkshop.js";

const validWorkshop = {
  title: "Intro to RAG",
  description: "A short session on retrieval-augmented generation.",
  topic: "AI engineering",
  startsAt: "2026-03-05T14:00:00-08:00",
  durationMinutes: 90,
  format: "online",
  location: "https://meet.example.com/rag",
  registrationUrl: "https://events.example.com/rag",
};

test("a complete valid workshop passes with trimmed values", () => {
  const result = validateWorkshop({ ...validWorkshop, title: "  Intro to RAG  " });
  assert.equal(result.valid, true);
  assert.equal(result.values.title, "Intro to RAG");
  assert.equal(result.values.startsAt, "2026-03-05T14:00:00-08:00");
});

test("missing or non-string required text fails with per-field errors", () => {
  for (const field of ["title", "description", "topic", "location"]) {
    const missing = validateWorkshop({ ...validWorkshop, [field]: undefined });
    assert.equal(missing.valid, false, `expected missing ${field} to fail`);
    assert.ok(missing.errors[field]);
    const wrongType = validateWorkshop({ ...validWorkshop, [field]: 42 });
    assert.equal(wrongType.valid, false, `expected numeric ${field} to fail`);
    assert.ok(wrongType.errors[field]);
  }
});

test("startsAt requires an explicit timezone offset and a real date", () => {
  const noOffset = validateWorkshop({ ...validWorkshop, startsAt: "2026-03-05T14:00:00" });
  assert.equal(noOffset.valid, false);
  assert.ok(noOffset.errors.startsAt);
  const dateOnly = validateWorkshop({ ...validWorkshop, startsAt: "2026-03-05" });
  assert.equal(dateOnly.valid, false);
  const nonsense = validateWorkshop({ ...validWorkshop, startsAt: "2026-13-45T99:00:00Z" });
  assert.equal(nonsense.valid, false);
  const utc = validateWorkshop({ ...validWorkshop, startsAt: "2026-03-05T22:00:00Z" });
  assert.equal(utc.valid, true);
});

test("duration must be a positive whole number of minutes", () => {
  for (const bad of [0, -30, 45.5, "90", null]) {
    const result = validateWorkshop({ ...validWorkshop, durationMinutes: bad });
    assert.equal(result.valid, false, `expected ${JSON.stringify(bad)} to fail`);
    assert.ok(result.errors.durationMinutes);
  }
  assert.equal(validateWorkshop({ ...validWorkshop, durationMinutes: 1 }).valid, true);
});

test("format must be online or in-person", () => {
  assert.equal(validateWorkshop({ ...validWorkshop, format: "hybrid" }).valid, false);
  assert.equal(validateWorkshop({ ...validWorkshop, format: 1 }).valid, false);
  assert.equal(validateWorkshop({ ...validWorkshop, format: "in-person" }).valid, true);
});

test("registrationUrl is optional but must be http or https when supplied", () => {
  const omitted = validateWorkshop({ ...validWorkshop, registrationUrl: undefined });
  assert.equal(omitted.valid, true);
  assert.equal(omitted.values.registrationUrl, "");
  const blank = validateWorkshop({ ...validWorkshop, registrationUrl: "   " });
  assert.equal(blank.valid, true);
  for (const bad of ["not-a-url", "ftp://events.example.com", "javascript:alert(1)", 7]) {
    const result = validateWorkshop({ ...validWorkshop, registrationUrl: bad });
    assert.equal(result.valid, false, `expected ${JSON.stringify(bad)} to fail`);
    assert.ok(result.errors.registrationUrl);
  }
});

test("unknown patch fields are flagged as unsupported", () => {
  const errors = workshopFieldErrors({ title: "New title", seats: 40, id: "x" });
  assert.ok(errors.seats);
  assert.ok(errors.id);
  assert.equal(errors.title, undefined);
});
