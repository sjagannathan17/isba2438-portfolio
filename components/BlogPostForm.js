"use client";

import Link from "next/link";
import styles from "@/components/ContactForm.module.css";

export default function BlogPostForm({
  values,
  onChange,
  onSubmit,
  errors,
  pending,
  submitLabel,
  successNote,
  failureNote,
  showCancel,
  onCancel,
}) {
  const fieldError = (field) =>
    errors[field] ? (
      <p id={`blog-${field}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {pending && (
        <p className={styles.pending} role="status">
          Saving...
        </p>
      )}
      {successNote && (
        <p className={styles.success} role="status">
          {successNote}
        </p>
      )}
      {failureNote && (
        <p className={styles.failure} role="alert">
          {failureNote}
        </p>
      )}
      {errors.form && (
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
          onChange={onChange("title")}
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
          onChange={onChange("description")}
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
          onChange={onChange("content")}
          aria-invalid={errors.content ? "true" : undefined}
          aria-describedby={errors.content ? "blog-content-error" : undefined}
        />
        {fieldError("content")}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </button>
      {showCancel && (
        <button type="button" className={styles.submit} onClick={onCancel} disabled={pending}>
          Cancel edit
        </button>
      )}
    </form>
  );
}
