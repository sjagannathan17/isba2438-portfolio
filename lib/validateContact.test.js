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
