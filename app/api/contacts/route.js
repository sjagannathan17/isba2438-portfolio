import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validateContact";
import { saveSubmission } from "@/lib/submissions";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const { valid, errors } = validateContact(body);
  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const entry = await saveSubmission({
      name: body.name,
      email: body.email,
      message: body.message,
      source: "api",
    });
    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { errors: { form: "Something went wrong saving your message. Please try again." } },
      { status: 500 }
    );
  }
}
