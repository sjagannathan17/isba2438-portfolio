function pad(value) {
  return String(value).padStart(2, "0");
}

export function toLocalInputValue(startsAt) {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function fromLocalInputValue(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export function describeInstant(startsAt) {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return { display: "", zone: "" };
  }
  let zone = "";
  try {
    zone =
      new Intl.DateTimeFormat(undefined, { timeZoneName: "shortOffset" })
        .formatToParts(date)
        .find((part) => part.type === "timeZoneName")?.value ?? "";
  } catch {
    zone = "UTC";
  }
  const display = date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return { display, zone };
}
