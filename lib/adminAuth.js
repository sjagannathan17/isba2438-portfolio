import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function safeEqual(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && secret()
  );
}

export function checkCredentials(username, password) {
  if (!adminConfigured()) {
    return false;
  }
  return (
    safeEqual(String(username ?? ""), process.env.ADMIN_USERNAME) &&
    safeEqual(String(password ?? ""), process.env.ADMIN_PASSWORD)
  );
}

export function createSessionToken(durationMs = SESSION_TTL_MS) {
  const expires = Date.now() + durationMs;
  const nonce = randomBytes(8).toString("base64url");
  const payload = `${expires}.${nonce}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (typeof token !== "string" || !secret()) {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }
  const [expires, nonce, signature] = parts;
  const expected = createHmac("sha256", secret())
    .update(`${expires}.${nonce}`)
    .digest("base64url");
  if (!safeEqual(signature, expected)) {
    return false;
  }
  const expiresAt = Number(expires);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function sessionCookieOptions(request) {
  const isHttps = request ? new URL(request.url).protocol === "https:" : false;
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function adminUnauthorized() {
  return {
    ok: false,
    response: {
      errors: { form: "Admin sign-in required." },
    },
    status: 401,
  };
}
