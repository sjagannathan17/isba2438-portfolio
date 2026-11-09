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

  return { valid: Object.keys(errors).length === 0, errors };
}
