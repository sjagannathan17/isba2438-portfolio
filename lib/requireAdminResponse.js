import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";

export function requireAdmin(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (verifySessionToken(token)) {
    return null;
  }
  return NextResponse.json(
    { errors: { form: "Admin sign-in required." } },
    { status: 401 }
  );
}
