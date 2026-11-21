"use client";

import { useEffect, useState } from "react";
import formStyles from "./ContactForm.module.css";
import styles from "./WorkshopAdmin.module.css";

const emptyForm = {
  name: "",
  email: "",
  message: "",
  company: "",
  role: "",
};

function formatDate(iso) {
  if (!iso) {
    return "Unknown";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString();
}

export default function ContactAdmin() {
  const [contacts, setContacts] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  async function loadContacts() {
    setListStatus("loading");
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error("failed");
      }
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
      setListStatus("ready");
    } catch {
      setListStatus("error");
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
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

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setStatus("idle");
    setNote(null);
  }

  function startEdit(contact) {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      email: contact.email,
      message: contact.message,
      company: contact.company ?? "",
      role: contact.role ?? "",
    });
    setErrors({});
    setStatus("idle");
    setNote(null);
    setConfirmId(null);
  }

  function buildPayload() {
    return {
      name: form.name,
      email: form.email,
      message: form.message,
      company: form.company,
      role: form.role,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "pending") {
      return;
    }
    setStatus("pending");
    setErrors({});
    setNote(null);
    try {
      const response = await fetch(
        editingId ? `/api/contacts/${editingId}` : "/api/contacts",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        setNote(editingId ? "Contact updated." : "Contact created.");
        if (!editingId) {
          setForm(emptyForm);
        }
        await loadContacts();
      } else if (response.status === 400) {
        setStatus("validation");
        setErrors(data.errors ?? { form: "Please check your entries and try again." });
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This contact no longer exists. The list below is refreshing.");
        setEditingId(null);
        setForm(emptyForm);
        await loadContacts();
      } else {
        setStatus("failure");
        setErrors(data.errors ?? { form: "Something went wrong. Your entries are preserved; please try again." });
      }
    } catch {
      setStatus("failure");
      setErrors({ form: "Could not reach the server. Your entries are preserved; please try again." });
    }
  }

  async function handleDelete(id) {
    if (status === "pending") {
      return;
    }
    const wasEditing = editingId === id;
    setStatus("pending");
    setErrors({});
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (response.status === 204 || response.status === 200) {
        setStatus("success");
        setNote("Contact deleted.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This contact no longer exists. The list below is refreshing.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else {
        setStatus("failure");
        setErrors({ form: "Something went wrong deleting. Please try again." });
      }
      setConfirmId(null);
      await loadContacts();
    } catch {
      setStatus("failure");
      setErrors({ form: "Could not reach the server. Please try again." });
    }
  }

  const pending = status === "pending";

  return (
    <div className={styles.admin}>
      <section className={styles.formSection} aria-labelledby="contact-form-heading">
        <h3 id="contact-form-heading" className={styles.sectionTitle}>
          {editingId ? "Edit contact" : "Create a contact"}
        </h3>
        {status === "pending" && (
          <p className={formStyles.pending} role="status">
            Saving...
          </p>
        )}
        {status === "success" && note && (
          <p className={formStyles.success} role="status">
            {note}
          </p>
        )}
        {status === "validation" && (
          <p className={formStyles.summary} role="alert">
            Please fix the errors below and try again.
          </p>
        )}
        {status === "failure" && note && (
          <p className={formStyles.failure} role="alert">
            {note}
          </p>
        )}
        {errors.form && (
          <p className={formStyles.summary} role="alert">
            {errors.form}
          </p>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className={formStyles.field}>
            <label htmlFor="ct-name">Name</label>
            <input
              id="ct-name"
              name="name"
              type="text"
              value={form.name}
              onChange={update("name")}
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "ct-name-error" : undefined}
            />
            {errors.name && (
              <p id="ct-name-error" className={formStyles.error}>
                {errors.name}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ct-email">Email</label>
            <input
              id="ct-email"
              name="email"
              type="email"
              value={form.email}
              onChange={update("email")}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "ct-email-error" : undefined}
            />
            {errors.email && (
              <p id="ct-email-error" className={formStyles.error}>
                {errors.email}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ct-message">Message</label>
            <textarea
              id="ct-message"
              name="message"
              rows={4}
              value={form.message}
              onChange={update("message")}
              aria-invalid={errors.message ? "true" : undefined}
              aria-describedby={errors.message ? "ct-message-error" : undefined}
            />
            {errors.message && (
              <p id="ct-message-error" className={formStyles.error}>
                {errors.message}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ct-company">Company (optional)</label>
            <input
              id="ct-company"
              name="company"
              type="text"
              value={form.company}
              onChange={update("company")}
              aria-invalid={errors.company ? "true" : undefined}
              aria-describedby={errors.company ? "ct-company-error" : undefined}
            />
            {errors.company && (
              <p id="ct-company-error" className={formStyles.error}>
                {errors.company}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ct-role">Role (optional)</label>
            <input
              id="ct-role"
              name="role"
              type="text"
              value={form.role}
              onChange={update("role")}
              aria-invalid={errors.role ? "true" : undefined}
              aria-describedby={errors.role ? "ct-role-error" : undefined}
            />
            {errors.role && (
              <p id="ct-role-error" className={formStyles.error}>
                {errors.role}
              </p>
            )}
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.primaryAction}
              disabled={pending}
            >
              {pending ? "Saving..." : editingId ? "Save changes" : "Create contact"}
            </button>
            {editingId && (
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={startCreate}
                disabled={pending}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection} aria-labelledby="contact-list-heading">
        <h3 id="contact-list-heading" className={styles.sectionTitle}>
          Existing contacts
        </h3>
        {listStatus === "loading" && (
          <p className={styles.hint} role="status">
            Loading contacts...
          </p>
        )}
        {listStatus === "error" && (
          <p className={formStyles.failure} role="alert">
            Contacts could not be loaded. Please try again.
          </p>
        )}
        {listStatus === "ready" && contacts.length === 0 && (
          <p className={styles.hint}>No contact submissions yet.</p>
        )}
        <ul className={styles.list}>
          {contacts.map((contact) => {
            const isDetailsOpen = detailsId === contact.id;
            const isConfirmOpen = confirmId === contact.id;
            return (
              <li key={contact.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>
                    {contact.name} &middot; {contact.email}
                  </p>
                  <p className={styles.rowMeta}>
                    Submitted {formatDate(contact.submitted ?? contact.createdAt)}
                    {contact.company ? ` · ${contact.company}` : ""}
                    {contact.role ? ` · ${contact.role}` : ""}
                  </p>
                </div>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    aria-expanded={isDetailsOpen}
                    onClick={() => setDetailsId(isDetailsOpen ? null : contact.id)}
                  >
                    {isDetailsOpen ? "Hide details" : "View details"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={() => startEdit(contact)}
                    disabled={pending}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerAction}
                    aria-expanded={isConfirmOpen}
                    onClick={() => setConfirmId(isConfirmOpen ? null : contact.id)}
                    disabled={pending}
                  >
                    Delete
                  </button>
                </div>
                {isDetailsOpen && (
                  <dl className={styles.details}>
                    <div>
                      <dt>Message</dt>
                      <dd>{contact.message}</dd>
                    </div>
                    <div>
                      <dt>Company</dt>
                      <dd>{contact.company || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>Role</dt>
                      <dd>{contact.role || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>Source</dt>
                      <dd>{contact.source}</dd>
                    </div>
                    <div>
                      <dt>ID</dt>
                      <dd>{contact.id}</dd>
                    </div>
                    <div>
                      <dt>Submitted</dt>
                      <dd>{contact.submitted ?? contact.createdAt}</dd>
                    </div>
                  </dl>
                )}
                {isConfirmOpen && (
                  <div className={styles.confirm} role="alertdialog" aria-label="Confirm deletion">
                    <p>
                      Delete the submission from &ldquo;{contact.name}
                      &rdquo;? This cannot be undone.
                    </p>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.dangerAction}
                        onClick={() => handleDelete(contact.id)}
                        disabled={pending}
                      >
                        Yes, delete
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryAction}
                        onClick={() => setConfirmId(null)}
                        disabled={pending}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
