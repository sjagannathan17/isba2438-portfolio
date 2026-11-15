export function validateBlog(input) {
  const errors = {};

  const fields = { title: input?.title, description: input?.description, content: input?.content };

  for (const [field, value] of Object.entries(fields)) {
    if (typeof value !== "string") {
      errors[field] = "This field is required and must be text.";
      continue;
    }
    if (value.trim() === "") {
      errors[field] =
        field === "title"
          ? "Please enter a title."
          : field === "description"
            ? "Please enter a short description."
            : "Please write some content.";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
