import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminConfigured, verifySessionToken } from "@/lib/adminAuth";

export async function GET(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return NextResponse.json(
    {
      authenticated: verifySessionToken(token),
      configured: adminConfigured(),
    },
    { status: 200 }
  );
}
