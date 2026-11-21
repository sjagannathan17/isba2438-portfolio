import { NextResponse } from "next/server";
import { validateWorkshop, workshopFieldErrors } from "@/lib/validateWorkshop";
import { readWorkshops, updateWorkshop, deleteWorkshop } from "@/lib/workshops";
import { logApiCall } from "@/lib/apiLogger";
import { requireAdmin } from "@/lib/requireAdminResponse";

function routeFor(id) {
  return `/api/workshops/${id}`;
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const workshops = await readWorkshops();
    const workshop = workshops.find((entry) => entry.id === id);
    if (!workshop) {
      logApiCall({ method: "GET", route: routeFor(id), status: 404 });
      return NextResponse.json(
        { errors: { form: "Workshop not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "GET", route: routeFor(id), status: 200, id });
    return NextResponse.json({ workshop }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: routeFor(id), status: 500 });
    return NextResponse.json(
      { errors: { form: "Workshop storage is temporarily unavailable. Please try again." } },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 401, id });
    return denied;
  }
  let body;
  try {
    body = await request.json();
  } catch {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400 });
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const unsupported = workshopFieldErrors(body);
  if (Object.keys(unsupported).length > 0) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400 });
    return NextResponse.json({ errors: unsupported }, { status: 400 });
  }

  try {
    const workshops = await readWorkshops();
    const existing = workshops.find((entry) => entry.id === id);
    if (!existing) {
      logApiCall({ method: "PATCH", route: routeFor(id), status: 404 });
      return NextResponse.json(
        { errors: { form: "Workshop not found." } },
        { status: 404 }
      );
    }

    const merged = { ...existing, ...body };
    const { valid, errors, values } = validateWorkshop(merged);
    if (!valid) {
      logApiCall({ method: "PATCH", route: routeFor(id), status: 400, id });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const entry = await updateWorkshop(id, values);
    if (!entry) {
      logApiCall({ method: "PATCH", route: routeFor(id), status: 404 });
      return NextResponse.json(
        { errors: { form: "Workshop not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "PATCH", route: routeFor(id), status: 200, id });
    return NextResponse.json({ ok: true, workshop: entry }, { status: 200 });
  } catch {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 500 });
    return NextResponse.json(
      { errors: { form: "Something went wrong updating the workshop. Please try again." } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "DELETE", route: routeFor(id), status: 401, id });
    return denied;
  }
  try {
    const deleted = await deleteWorkshop(id);
    if (!deleted) {
      logApiCall({ method: "DELETE", route: routeFor(id), status: 404 });
      return NextResponse.json(
        { errors: { form: "Workshop not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "DELETE", route: routeFor(id), status: 204, id });
    return new NextResponse(null, { status: 204 });
  } catch {
    logApiCall({ method: "DELETE", route: routeFor(id), status: 500 });
    return NextResponse.json(
      { errors: { form: "Something went wrong deleting the workshop. Please try again." } },
      { status: 500 }
    );
  }
}
