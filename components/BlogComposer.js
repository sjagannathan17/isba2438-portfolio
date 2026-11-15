"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/components/ContactForm.module.css";

const emptyValues = { title: "", description: "", content: "" };

export default function BlogComposer() {
  const [values, setValues] = useState(emptyValues);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);
  const [pending, setPending] = useState(false);

  function update(field) {
    return (event) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => {
        if (!current[field]) {
          return current;
        }
        const next = { ...current };
        delete next[field];
        return next;
      });
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setStatus("pending");
    setErrors({});
    setCreated(null);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 201) {
        setStatus("success");
        setCreated({ slug: data.slug, title: values.title.trim() });
        setValues(emptyValues);
      } else if (response.status === 400) {
        setStatus("validation");
        setErrors(data.errors ?? { form: "Please check your entries and try again." });
      } else {
        setStatus("failure");
        setErrors(data.errors ?? {});
      }
    } catch {
      setStatus("failure");
    } finally {
      setPending(false);
    }
  }

  const fieldError = (field) =>
    errors[field] ? (
      <p id={`blog-${field}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      {status === "pending" && (
        <p className={styles.pending} role="status">
          Publishing...
        </p>
      )}
      {status === "success" && (
        <p className={styles.success} role="status">
          Post published!{" "}
          <Link href={`/blogs/${created?.slug ?? ""}`}>View &ldquo;{created?.title}&rdquo;</Link>
        </p>
      )}
      {status === "failure" && (
        <p className={styles.failure} role="alert">
          Something went wrong saving your post. Please try again.
        </p>
      )}
      {status === "validation" && (
        <p className={styles.summary} role="alert">
          Please fix the errors below and publish again.
        </p>
      )}
      {errors.form && status !== "validation" && (
        <p className={styles.summary} role="alert">
          {errors.form}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="blog-title">Title</label>
        <input
          id="blog-title"
          name="title"
          type="text"
          value={values.title}
          onChange={update("title")}
          aria-invalid={errors.title ? "true" : undefined}
          aria-describedby={errors.title ? "blog-title-error" : undefined}
        />
        {fieldError("title")}
      </div>

      <div className={styles.field}>
        <label htmlFor="blog-description">Short description</label>
        <input
          id="blog-description"
          name="description"
          type="text"
          value={values.description}
          onChange={update("description")}
          aria-invalid={errors.description ? "true" : undefined}
          aria-describedby={errors.description ? "blog-description-error" : undefined}
        />
        {fieldError("description")}
      </div>

      <div className={styles.field}>
        <label htmlFor="blog-content">Content</label>
        <textarea
          id="blog-content"
          name="content"
          rows={12}
          value={values.content}
          onChange={update("content")}
          aria-invalid={errors.content ? "true" : undefined}
          aria-describedby={errors.content ? "blog-content-error" : undefined}
        />
        {fieldError("content")}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Publishing..." : "Publish post"}
      </button>
    </form>
  );
}
