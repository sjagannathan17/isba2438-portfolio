import assert from "node:assert/strict";
import { test } from "node:test";
import { toLocalInputValue, fromLocalInputValue, describeInstant } from "./workshopTime.js";

test("local input round-trip preserves the instant regardless of original offset", () => {
  for (const startsAt of [
    "2026-03-05T14:00:00-08:00",
    "2026-03-05T22:00:00Z",
    "2026-03-06T09:00:00+05:30",
  ]) {
    const localValue = toLocalInputValue(startsAt);
    const roundTripped = fromLocalInputValue(localValue);
    assert.ok(roundTripped, `expected ${localValue} to parse`);
    assert.equal(Date.parse(roundTripped), Date.parse(startsAt));
  }
});

test("unedited prefill keeps the exact instant including seconds", () => {
  const startsAt = "2026-03-05T14:00:00-08:00";
  const localValue = toLocalInputValue(startsAt);
  assert.match(localValue, /T\d{2}:\d{2}:\d{2}$/);
  assert.equal(Date.parse(fromLocalInputValue(localValue)), Date.parse(startsAt));
});

test("invalid input values return empty or null instead of crashing", () => {
  assert.equal(toLocalInputValue("not a date"), "");
  assert.equal(fromLocalInputValue(""), null);
  assert.equal(fromLocalInputValue("garbage"), null);
});

test("describeInstant returns a display string with a zone label", () => {
  const { display, zone } = describeInstant("2026-03-05T14:00:00-08:00");
  assert.match(display, /2026|Mar/);
  assert.notEqual(zone, "");
});
