import { NextResponse } from "next/server";
import { readSubmissions, updateSubmission, deleteSubmission } from "@/lib/submissions";
import { validateContact, contactFieldErrors } from "@/lib/validateContact";
import { requireAdmin } from "@/lib/requireAdminResponse";
import { logApiCall } from "@/lib/apiLogger";

const ROUTE = "/api/contacts/[id]";

async function findContact(id) {
  const submissions = await readSubmissions();
  return submissions.find((entry) => entry.id === id) ?? null;
}

export async function GET(request, context) {
  const { id } = await context.params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "GET", route: ROUTE, status: 401, id });
    return denied;
  }

  try {
    const contact = await findContact(id);
    if (!contact) {
      logApiCall({ method: "GET", route: ROUTE, status: 404, id });
      return NextResponse.json(
        { errors: { form: "Contact not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "GET", route: ROUTE, status: 200, id });
    return NextResponse.json({ contact }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: ROUTE, status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong reading this contact." } },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
  const { id } = await context.params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "PATCH", route: ROUTE, status: 401, id });
    return denied;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    logApiCall({ method: "PATCH", route: ROUTE, status: 400, id });
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const fieldErrors = contactFieldErrors(body);
  if (Object.keys(fieldErrors).length > 0) {
    logApiCall({ method: "PATCH", route: ROUTE, status: 400, id });
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  let existing;
  try {
    existing = await findContact(id);
  } catch {
    existing = null;
  }
  if (!existing) {
    logApiCall({ method: "PATCH", route: ROUTE, status: 404, id });
    return NextResponse.json(
      { errors: { form: "Contact not found." } },
      { status: 404 }
    );
  }

  const { valid, errors, values } = validateContact({
    name: body.name ?? existing.name,
    email: body.email ?? existing.email,
    message: body.message ?? existing.message,
    company: body.company ?? existing.company,
    role: body.role ?? existing.role,
  });
  if (!valid) {
    logApiCall({ method: "PATCH", route: ROUTE, status: 400, id });
    return NextResponse.json({ errors }, { status: 400 });
  }

  const updates = {
    name: values.name,
    email: values.email,
    message: values.message,
  };
  if (values.company) {
    updates.company = values.company;
  } else if (body.company !== undefined) {
    updates.company = undefined;
  }
  if (values.role) {
    updates.role = values.role;
  } else if (body.role !== undefined) {
    updates.role = undefined;
  }

  try {
    const entry = await updateSubmission(id, updates);
    if (!entry) {
      logApiCall({ method: "PATCH", route: ROUTE, status: 404, id });
      return NextResponse.json(
        { errors: { form: "Contact not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "PATCH", route: ROUTE, status: 200, id });
    return NextResponse.json({ ok: true, contact: entry }, { status: 200 });
  } catch {
    logApiCall({ method: "PATCH", route: ROUTE, status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong saving this contact." } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "DELETE", route: ROUTE, status: 401, id });
    return denied;
  }

  try {
    const removed = await deleteSubmission(id);
    if (!removed) {
      logApiCall({ method: "DELETE", route: ROUTE, status: 404, id });
      return NextResponse.json(
        { errors: { form: "Contact not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "DELETE", route: ROUTE, status: 204, id });
    return new NextResponse(null, { status: 204 });
  } catch {
    logApiCall({ method: "DELETE", route: ROUTE, status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong deleting this contact." } },
      { status: 500 }
    );
  }
}
