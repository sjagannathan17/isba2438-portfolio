import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  checkCredentials,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/adminAuth";
import { logApiCall } from "@/lib/apiLogger";

const ROUTE = "/api/admin/login";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    logApiCall({ method: "POST", route: ROUTE, status: 400 });
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  if (!checkCredentials(body?.username, body?.password)) {
    logApiCall({ method: "POST", route: ROUTE, status: 401 });
    return NextResponse.json(
      { errors: { form: "Invalid admin credentials, or admin access is not configured." } },
      { status: 401 }
    );
  }

  const token = createSessionToken();
  logApiCall({ method: "POST", route: ROUTE, status: 200 });
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(ADMIN_COOKIE_NAME, token, sessionCookieOptions(request));
  return response;
}
