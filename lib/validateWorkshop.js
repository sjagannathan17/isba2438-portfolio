const TEXT_CAPS = { title: 200, description: 500, topic: 100, location: 300 };
const SUPPORTED_FORMATS = ["online", "in-person"];
const OFFSET_PATTERN = /(Z|[+-]\d{2}:\d{2})$/;

function requiredText(value, field, label, errors) {
  if (typeof value !== "string") {
    errors[field] = `${label} is required and must be text.`;
    return null;
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    errors[field] = `Please enter a ${label.toLowerCase()}.`;
    return null;
  }
  if (trimmed.length > TEXT_CAPS[field]) {
    errors[field] = `${label} must be ${TEXT_CAPS[field]} characters or fewer.`;
    return null;
  }
  return trimmed;
}

function validStartsAt(value, errors) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.startsAt = "Please enter a start date and time.";
    return null;
  }
  const trimmed = value.trim();
  if (!OFFSET_PATTERN.test(trimmed)) {
    errors.startsAt =
      "Start date and time needs an explicit timezone offset, like 2026-03-05T14:00:00-08:00 or 2026-03-05T14:00:00Z.";
    return null;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    errors.startsAt = "Start date and time is not a valid date.";
    return null;
  }
  return trimmed;
}

function validDuration(value, errors) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    errors.durationMinutes = "Duration must be a whole number of minutes greater than zero.";
    return null;
  }
  return value;
}

function validFormat(value, errors) {
  if (typeof value !== "string" || !SUPPORTED_FORMATS.includes(value)) {
    errors.format = "Format must be either online or in-person.";
    return null;
  }
  return value;
}

function optionalUrl(value, field, label, errors) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  if (typeof value !== "string") {
    errors[field] = `${label} must be text or omitted.`;
    return null;
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    errors[field] = `${label} must be a valid HTTP or HTTPS URL.`;
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    errors[field] = `${label} must be a valid HTTP or HTTPS URL.`;
    return null;
  }
  return trimmed;
}

export function validateWorkshop(input) {
  const errors = {};
  const title = requiredText(input?.title, "title", "Title", errors);
  const description = requiredText(input?.description, "description", "Short description", errors);
  const topic = requiredText(input?.topic, "topic", "Topic", errors);
  const startsAt = validStartsAt(input?.startsAt, errors);
  const durationMinutes = validDuration(input?.durationMinutes, errors);
  const format = validFormat(input?.format, errors);
  const location = requiredText(input?.location, "location", "Location or meeting URL", errors);
  const registrationUrl = optionalUrl(input?.registrationUrl, "registrationUrl", "Registration URL", errors);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { title, description, topic, startsAt, durationMinutes, format, location, registrationUrl },
  };
}

export function workshopFieldErrors(update) {
  const errors = {};
  const known = ["title", "description", "topic", "startsAt", "durationMinutes", "format", "location", "registrationUrl"];
  for (const key of Object.keys(update ?? {})) {
    if (!known.includes(key)) {
      errors[key] = "This field is not supported.";
    }
  }
  return errors;
}
