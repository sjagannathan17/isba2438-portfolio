"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

const emptyValues = { name: "", email: "", message: "" };

export default function ContactApiForm() {
  const [values, setValues] = useState(emptyValues);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
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
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 201) {
        setStatus("success");
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
      <p id={`api-contact-${field}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      {status === "pending" && (
        <p className={styles.pending} role="status">
          Sending...
        </p>
      )}
      {status === "success" && (
        <p className={styles.success} role="status">
          Thanks, your message was sent! I will get back to you soon.
        </p>
      )}
      {status === "failure" && (
        <p className={styles.failure} role="alert">
          Something went wrong sending your message. Please try again.
        </p>
      )}
      {status === "validation" && (
        <p className={styles.summary} role="alert">
          Please fix the errors below and send your message again.
        </p>
      )}
      {errors.form && status !== "validation" && (
        <p className={styles.summary} role="alert">
          {errors.form}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="api-contact-name">Name</label>
        <input
          id="api-contact-name"
          name="name"
          type="text"
          value={values.name}
          onChange={update("name")}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "api-contact-name-error" : undefined}
        />
        {fieldError("name")}
      </div>

      <div className={styles.field}>
        <label htmlFor="api-contact-email">Email</label>
        <input
          id="api-contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={update("email")}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "api-contact-email-error" : undefined}
        />
        {fieldError("email")}
      </div>

      <div className={styles.field}>
        <label htmlFor="api-contact-message">Message</label>
        <textarea
          id="api-contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={update("message")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "api-contact-message-error" : undefined}
        />
        {fieldError("message")}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
