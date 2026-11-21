import assert from "node:assert/strict";
import { test } from "node:test";
import {
  adminConfigured,
  checkCredentials,
  createSessionToken,
  verifySessionToken,
} from "./adminAuth.js";

process.env.ADMIN_USERNAME = "test-admin";
process.env.ADMIN_PASSWORD = "test-pass-12345";
process.env.ADMIN_SESSION_SECRET = "test-secret-67890";

test("configured reports readiness only when all three env values exist", () => {
  assert.equal(adminConfigured(), true);
  const saved = process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(adminConfigured(), false);
  process.env.ADMIN_SESSION_SECRET = saved;
});

test("correct credentials pass and wrong ones fail", () => {
  assert.equal(checkCredentials("test-admin", "test-pass-12345"), true);
  assert.equal(checkCredentials("test-admin", "wrong"), false);
  assert.equal(checkCredentials("nobody", "test-pass-12345"), false);
  assert.equal(checkCredentials(undefined, undefined), false);
});

test("a fresh token verifies and an expired one does not", () => {
  assert.equal(verifySessionToken(createSessionToken()), true);
  const expired = createSessionToken(-1000);
  assert.equal(verifySessionToken(expired), false);
});

test("tampered or foreign tokens are rejected", () => {
  const token = createSessionToken();
  const [expires, nonce] = token.split(".");
  assert.equal(verifySessionToken(`${expires}.${nonce}.bad-signature`), false);
  assert.equal(verifySessionToken(`9999999999999.${nonce}.${token.split(".")[2]}`), false);
  assert.equal(verifySessionToken("garbage"), false);
  assert.equal(verifySessionToken(undefined), false);
  const saved = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = "a-different-secret";
  assert.equal(verifySessionToken(token), false);
  process.env.ADMIN_SESSION_SECRET = saved;
});
