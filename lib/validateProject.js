const REQUIRED_TEXT = {
  name: "Please enter a project name.",
  tag: "Please enter a tag line.",
  context: "Please enter the setting for this project.",
  year: "Please enter a year.",
  timeframe: "Please enter a timeframe.",
  roleSummary: "Please enter a role summary.",
  blurb: "Please enter a short blurb.",
  summary: "Please describe how the product works.",
  why: "Please describe the problem.",
  contribution: "Please describe the contribution.",
  impact: "Please describe the outcome.",
};

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProject(input) {
  const errors = {};

  for (const [field, message] of Object.entries(REQUIRED_TEXT)) {
    const value = input?.[field];
    if (typeof value !== "string" || value.trim() === "") {
      errors[field] = message;
    }
  }

  if (input?.recognition !== undefined && input.recognition !== null) {
    if (typeof input.recognition !== "string") {
      errors.recognition = "Recognition must be text.";
    }
  }

  const tech = input?.tech;
  if (!Array.isArray(tech) || tech.length === 0) {
    errors.tech = "Please list at least one tool or technique.";
  } else if (
    tech.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    errors.tech = "Each tool must be non-empty text.";
  }

  const link = input?.link;
  if (
    !link ||
    typeof link !== "object" ||
    Array.isArray(link) ||
    typeof link.label !== "string" ||
    link.label.trim() === "" ||
    typeof link.url !== "string" ||
    !isHttpUrl(link.url.trim())
  ) {
    errors.link = "Please provide a label and a valid http(s) link.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function projectFieldErrors(update) {
  const errors = {};
  const known = [
    "name",
    "tag",
    "context",
    "year",
    "timeframe",
    "roleSummary",
    "blurb",
    "summary",
    "why",
    "contribution",
    "impact",
    "recognition",
    "tech",
    "link",
  ];
  for (const key of Object.keys(update ?? {})) {
    if (!known.includes(key)) {
      errors[key] = "This field is not supported.";
    }
  }
  return errors;
}
