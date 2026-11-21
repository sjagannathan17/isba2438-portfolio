export function validateEmail(email) {
  if (email === "") {
    return "Please enter your email address.";
  }
  if (/\s/.test(email)) {
    return "Email can't contain spaces, tabs, or line breaks.";
  }
  const atCount = (email.match(/@/g) || []).length;
  if (atCount === 0) {
    return "Email needs an @ sign.";
  }
  if (atCount > 1) {
    return "Email can only have one @ sign.";
  }
  const [local, domain] = email.split("@");
  if (local.length === 0) {
    return "Email needs some text before the @ sign.";
  }
  if (!domain.includes(".")) {
    return "Email domain needs a dot, like example.com.";
  }
  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return "Email domain can't start or end with a dot, or have two dots in a row.";
  }
  return null;
}

function optionalText(value, label, field, errors) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  if (typeof value !== "string") {
    errors[field] = `${label} must be text.`;
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length > 200) {
    errors[field] = `${label} must be 200 characters or fewer.`;
    return null;
  }
  return trimmed;
}

export function validateContact(input) {
  const name = typeof input?.name === "string" ? input.name : "";
  const email = typeof input?.email === "string" ? input.email : "";
  const message = typeof input?.message === "string" ? input.message : "";

  const errors = {};
  if (name.trim() === "") {
    errors.name = "Please enter your name.";
  }
  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }
  if (message.trim() === "") {
    errors.message = "Please enter a message.";
  }
  const company = optionalText(input?.company, "Company", "company", errors);
  const role = optionalText(input?.role, "Role or opportunity", "role", errors);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { name: name.trim(), email: email.trim(), message: message.trim(), company, role },
  };
}

export function contactFieldErrors(update) {
  const errors = {};
  const known = ["name", "email", "message", "company", "role"];
  for (const key of Object.keys(update ?? {})) {
    if (!known.includes(key)) {
      errors[key] = "This field is not supported.";
    }
  }
  return errors;
}
