import assert from "node:assert/strict";
import { test } from "node:test";
import { validateContact, validateEmail } from "./validateContact.js";

test("valid input passes with no errors", () => {
  const result = validateContact({
    name: "Sri",
    email: "a@b.com",
    message: "Hello there",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("blank name fails, including spaces only", () => {
  assert.equal(validateContact({ name: "", email: "a@b.com", message: "Hi" }).valid, false);
  assert.ok(validateContact({ name: "   ", email: "a@b.com", message: "Hi" }).errors.name);
});

test("blank message fails, including spaces only", () => {
  assert.equal(validateContact({ name: "Sri", email: "a@b.com", message: "" }).valid, false);
  assert.ok(validateContact({ name: "Sri", email: "a@b.com", message: "   " }).errors.message);
});

test("bad emails fail", () => {
  const bad = [
    "a@b",
    "a@@b.com",
    "@b.com",
    "a@b..com",
    "a@.com",
    "a@b.com.",
    "a b@c.com",
    "a\tb@c.com",
  ];
  for (const email of bad) {
    assert.ok(validateEmail(email), `expected ${JSON.stringify(email)} to fail`);
  }
});

test("good emails pass", () => {
  const good = ["a@b.com", "first.last@sub.domain.org"];
  for (const email of good) {
    assert.equal(validateEmail(email), null, `expected ${email} to pass`);
  }
});

test("missing fields are treated as empty, not a crash", () => {
  const result = validateContact({});
  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
  assert.equal(validateContact({ name: "Sri", email: "a@b.com", message: "Hi" }).valid, true);
});

test("optional company and role accept omitted, empty, and whitespace values", () => {
  const omitted = validateContact({ name: "Sri", email: "a@b.com", message: "Hi" });
  assert.equal(omitted.valid, true);
  assert.equal(omitted.values.company, "");
  assert.equal(omitted.values.role, "");
  const blank = validateContact({ name: "Sri", email: "a@b.com", message: "Hi", company: "   ", role: null });
  assert.equal(blank.valid, true);
  assert.equal(blank.values.company, "");
  assert.equal(blank.values.role, "");
});

test("optional company and role are trimmed", () => {
  const result = validateContact({ name: "Sri", email: "a@b.com", message: "Hi", company: "  Acme Fintech  ", role: "\nAPM\n" });
  assert.equal(result.valid, true);
  assert.equal(result.values.company, "Acme Fintech");
  assert.equal(result.values.role, "APM");
});

test("invalid optional types are rejected without touching other fields", () => {
  const bad = validateContact({ name: "Sri", email: "a@b.com", message: "Hi", company: 42 });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.company);
  assert.equal(bad.errors.name, undefined);
  const worse = validateContact({ name: "Sri", email: "a@b.com", message: "Hi", role: { deep: true } });
  assert.equal(worse.valid, false);
  assert.ok(worse.errors.role);
});

test("optional fields reject over 200 characters and accept exactly 200", () => {
  const long = "x".repeat(201);
  const rejected = validateContact({ name: "Sri", email: "a@b.com", message: "Hi", company: long });
  assert.equal(rejected.valid, false);
  assert.ok(rejected.errors.company);
  const ok200 = validateContact({ name: "Sri", email: "a@b.com", message: "Hi", role: "x".repeat(200) });
  assert.equal(ok200.valid, true);
  assert.equal(ok200.values.role, "x".repeat(200));
});
