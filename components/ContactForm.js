"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/app/contact-me-server-form/actions";
import styles from "./ContactForm.module.css";

const initialState = {
  status: "idle",
  errors: {},
  values: { name: "", email: "", message: "" },
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state.status === "success" && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  const {
    errors = {},
    values = { name: "", email: "", message: "" },
  } = state;

  return (
    <form ref={formRef} action={formAction} className={styles.form} noValidate>
      {state.status === "success" && (
        <p className={styles.success} role="status">
          Thanks, your message was sent! I will get back to you soon.
        </p>
      )}
      {state.status === "failure" && (
        <p className={styles.failure} role="alert">
          Something went wrong sending your message. Please try again.
        </p>
      )}
      {state.status === "validation" && (
        <p className={styles.summary} role="alert">
          Please fix the errors below and send your message again.
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          defaultValue={values.name}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          defaultValue={values.email}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          defaultValue={values.message}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
