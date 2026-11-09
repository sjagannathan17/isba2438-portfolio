"use server";

import { validateContact } from "@/lib/validateContact";
import { saveSubmission } from "@/lib/submissions";

export async function submitContact(_previousState, formData) {
  const name = formData.get("name") ?? "";
  const email = formData.get("email") ?? "";
  const message = formData.get("message") ?? "";

  const values = { name: String(name), email: String(email), message: String(message) };
  const { valid, errors } = validateContact(values);

  if (!valid) {
    return { status: "validation", errors, values };
  }

  try {
    await saveSubmission({
      name: values.name,
      email: values.email,
      message: values.message,
      source: "server-form",
    });
  } catch {
    return { status: "failure", errors: {}, values };
  }

  return { status: "success" };
}
