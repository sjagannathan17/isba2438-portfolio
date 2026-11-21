import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { logApiCall } from "@/lib/apiLogger";

const ROUTE = "/api/admin/logout";

export async function POST(request) {
  logApiCall({ method: "POST", route: ROUTE, status: 200 });
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
