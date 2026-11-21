import { NextResponse } from "next/server";
import { validateWorkshop } from "@/lib/validateWorkshop";
import { readWorkshops, saveWorkshop } from "@/lib/workshops";
import { logApiCall } from "@/lib/apiLogger";
import { requireAdmin } from "@/lib/requireAdminResponse";

const ROUTE = "/api/workshops";

export async function GET() {
  try {
    const workshops = await readWorkshops();
    const sorted = [...workshops].sort((a, b) => (a.startsAt > b.startsAt ? 1 : -1));
    logApiCall({ method: "GET", route: ROUTE, status: 200 });
    return NextResponse.json({ workshops: sorted }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: ROUTE, status: 500 });
    return NextResponse.json(
      { errors: { form: "Workshop storage is temporarily unavailable. Please try again." } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "POST", route: ROUTE, status: 401 });
    return denied;
  }

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

  const { valid, errors, values } = validateWorkshop(body);
  if (!valid) {
    logApiCall({ method: "POST", route: ROUTE, status: 400 });
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const entry = await saveWorkshop(values);
    logApiCall({ method: "POST", route: ROUTE, status: 201, id: entry.id });
    return NextResponse.json({ ok: true, workshop: entry }, { status: 201 });
  } catch {
    logApiCall({ method: "POST", route: ROUTE, status: 500 });
    return NextResponse.json(
      { errors: { form: "Something went wrong saving the workshop. Please try again." } },
      { status: 500 }
    );
  }
}
