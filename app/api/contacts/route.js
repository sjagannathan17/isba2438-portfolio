import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validateContact";
import { readSubmissions, saveSubmission } from "@/lib/submissions";
import { requireAdmin } from "@/lib/requireAdminResponse";
import { logApiCall } from "@/lib/apiLogger";

const ROUTE = "/api/contacts";
export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "GET", route: ROUTE, status: 401 });
    return denied;
  }

  try {
    const submissions = await readSubmissions();
    const sorted = [...submissions].sort((a, b) => {
      const at = new Date(a.submitted ?? a.createdAt ?? 0).getTime();
      const bt = new Date(b.submitted ?? b.createdAt ?? 0).getTime();
      return bt - at;
    });
    logApiCall({ method: "GET", route: ROUTE, status: 200 });
    return NextResponse.json({ contacts: sorted }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: ROUTE, status: 500 });
    return NextResponse.json(
      { errors: { form: "Something went wrong reading contact submissions." } },
      { status: 500 }
    );
  }
}

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

  const { valid, errors, values } = validateContact(body);
  if (!valid) {
    logApiCall({ method: "POST", route: ROUTE, status: 400 });
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const entry = await saveSubmission({
      name: values.name,
      email: values.email,
      message: values.message,
      company: values.company || undefined,
      role: values.role || undefined,
      source: "api",
    });
    logApiCall({ method: "POST", route: ROUTE, status: 201, id: entry.id });
    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch {
    logApiCall({ method: "POST", route: ROUTE, status: 500 });
    return NextResponse.json(
      { errors: { form: "Something went wrong saving your message. Please try again." } },
      { status: 500 }
    );
  }
}
