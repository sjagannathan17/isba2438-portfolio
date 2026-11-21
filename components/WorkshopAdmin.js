"use client";

import { useEffect, useRef, useState } from "react";
import { fromLocalInputValue, toLocalInputValue, describeInstant } from "@/lib/workshopTime";
import formStyles from "./ContactForm.module.css";
import styles from "./WorkshopAdmin.module.css";

const emptyForm = {
  title: "",
  description: "",
  topic: "",
  startsAt: "",
  durationMinutes: "60",
  format: "online",
  location: "",
  registrationUrl: "",
};

export default function WorkshopAdmin() {
  const [workshops, setWorkshops] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);
  const originalStartsAtRef = useRef(null);

  async function loadWorkshops() {
    setListStatus("loading");
    try {
      const response = await fetch("/api/workshops");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error("failed");
      }
      setWorkshops(Array.isArray(data.workshops) ? data.workshops : []);
      setListStatus("ready");
    } catch {
      setListStatus("error");
    }
  }

  useEffect(() => {
    loadWorkshops();
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
    originalStartsAtRef.current = null;
    setForm(emptyForm);
    setErrors({});
    setStatus("idle");
  }

  function startEdit(workshop) {
    setEditingId(workshop.id);
    originalStartsAtRef.current = workshop.startsAt;
    setForm({
      title: workshop.title,
      description: workshop.description,
      topic: workshop.topic,
      startsAt: toLocalInputValue(workshop.startsAt),
      durationMinutes: String(workshop.durationMinutes),
      format: workshop.format,
      location: workshop.location,
      registrationUrl: workshop.registrationUrl ?? "",
    });
    setErrors({});
    setStatus("idle");
    setNote(null);
    setConfirmId(null);
  }

  function buildPayload() {
    const payload = {
      title: form.title,
      description: form.description,
      topic: form.topic,
      durationMinutes: Number(form.durationMinutes),
      format: form.format,
      location: form.location,
      registrationUrl: form.registrationUrl,
    };
    const original = originalStartsAtRef.current;
    const untouched =
      original &&
      form.startsAt.slice(0, 16) === toLocalInputValue(original).slice(0, 16);
    if (untouched) {
      payload.startsAt = original;
    } else {
      const startsAt = fromLocalInputValue(form.startsAt);
      payload.startsAt = startsAt ?? (form.startsAt.trim() === "" ? "" : form.startsAt);
    }
    return payload;
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
        editingId ? `/api/workshops/${editingId}` : "/api/workshops",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        setNote(
          editingId
            ? "Workshop updated."
            : "Workshop created. It is live on the public board."
        );
        if (!editingId) {
          setForm(emptyForm);
        }
        await loadWorkshops();
      } else if (response.status === 400) {
        setStatus("validation");
        setErrors(data.errors ?? { form: "Please check your entries and try again." });
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This workshop no longer exists. The list below is refreshing.");
        setEditingId(null);
        setForm(emptyForm);
        await loadWorkshops();
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
      const response = await fetch(`/api/workshops/${id}`, { method: "DELETE" });
      if (response.status === 204 || response.status === 200) {
        setStatus("success");
        setNote("Workshop deleted.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This workshop no longer exists. The list below is refreshing.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else {
        setStatus("failure");
        setErrors({ form: "Something went wrong deleting. Please try again." });
      }
      setConfirmId(null);
      await loadWorkshops();
    } catch {
      setStatus("failure");
      setErrors({ form: "Could not reach the server. Please try again." });
    }
  }

  const instantPreview = fromLocalInputValue(form.startsAt);
  const zoneLabel = describeInstant(instantPreview ?? "").zone;
  const pending = status === "pending";

  return (
    <div className={styles.admin}>
      <section className={styles.formSection} aria-labelledby="workshop-form-heading">
        <h3 id="workshop-form-heading" className={styles.sectionTitle}>
          {editingId ? "Edit workshop" : "Create a workshop"}
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
            <label htmlFor="ws-title">Title</label>
            <input
              id="ws-title"
              name="title"
              type="text"
              value={form.title}
              onChange={update("title")}
              aria-invalid={errors.title ? "true" : undefined}
              aria-describedby={errors.title ? "ws-title-error" : undefined}
            />
            {errors.title && (
              <p id="ws-title-error" className={formStyles.error}>
                {errors.title}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-description">Short description</label>
            <input
              id="ws-description"
              name="description"
              type="text"
              value={form.description}
              onChange={update("description")}
              aria-invalid={errors.description ? "true" : undefined}
              aria-describedby={errors.description ? "ws-description-error" : undefined}
            />
            {errors.description && (
              <p id="ws-description-error" className={formStyles.error}>
                {errors.description}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-topic">Topic</label>
            <input
              id="ws-topic"
              name="topic"
              type="text"
              value={form.topic}
              onChange={update("topic")}
              aria-invalid={errors.topic ? "true" : undefined}
              aria-describedby={errors.topic ? "ws-topic-error" : undefined}
            />
            {errors.topic && (
              <p id="ws-topic-error" className={formStyles.error}>
                {errors.topic}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-starts-at">
              Start date and time (entered in your local timezone
              {zoneLabel ? `, shown as ${zoneLabel}` : ""})
            </label>
            <input
              id="ws-starts-at"
              name="startsAt"
              type="datetime-local"
              step={1}
              value={form.startsAt}
              onChange={update("startsAt")}
              aria-invalid={errors.startsAt ? "true" : undefined}
              aria-describedby="ws-starts-at-hint"
            />
            {errors.startsAt && (
              <p id="ws-starts-at-error" className={formStyles.error}>
                {errors.startsAt}
              </p>
            )}
            <p id="ws-starts-at-hint" className={styles.hint}>
              {instantPreview
                ? `Stored with an explicit offset as ${instantPreview} (UTC). The original instant is preserved when editing without changing the time.`
                : "Saved with an explicit timezone offset; the public board shows the event in the visitor's timezone."}
            </p>
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-duration">Duration in minutes</label>
            <input
              id="ws-duration"
              name="durationMinutes"
              type="number"
              min={1}
              step={1}
              value={form.durationMinutes}
              onChange={update("durationMinutes")}
              aria-invalid={errors.durationMinutes ? "true" : undefined}
              aria-describedby={errors.durationMinutes ? "ws-duration-error" : undefined}
            />
            {errors.durationMinutes && (
              <p id="ws-duration-error" className={formStyles.error}>
                {errors.durationMinutes}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-format">Format</label>
            <select
              id="ws-format"
              name="format"
              value={form.format}
              onChange={update("format")}
            >
              <option value="online">Online</option>
              <option value="in-person">In person</option>
            </select>
            {errors.format && (
              <p className={formStyles.error}>{errors.format}</p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-location">
              Location or meeting URL
            </label>
            <input
              id="ws-location"
              name="location"
              type="text"
              value={form.location}
              onChange={update("location")}
              aria-invalid={errors.location ? "true" : undefined}
              aria-describedby={errors.location ? "ws-location-error" : undefined}
            />
            {errors.location && (
              <p id="ws-location-error" className={formStyles.error}>
                {errors.location}
              </p>
            )}
          </div>
          <div className={formStyles.field}>
            <label htmlFor="ws-registration">Registration URL (optional)</label>
            <input
              id="ws-registration"
              name="registrationUrl"
              type="url"
              value={form.registrationUrl}
              onChange={update("registrationUrl")}
              aria-invalid={errors.registrationUrl ? "true" : undefined}
              aria-describedby={errors.registrationUrl ? "ws-registration-error" : undefined}
            />
            {errors.registrationUrl && (
              <p id="ws-registration-error" className={formStyles.error}>
                {errors.registrationUrl}
              </p>
            )}
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.primaryAction}
              disabled={pending}
            >
              {pending ? "Saving..." : editingId ? "Save changes" : "Create workshop"}
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

      <section className={styles.listSection} aria-labelledby="workshop-list-heading">
        <h3 id="workshop-list-heading" className={styles.sectionTitle}>
          Existing workshops
        </h3>
        {listStatus === "loading" && (
          <p className={styles.hint} role="status">
            Loading workshops...
          </p>
        )}
        {listStatus === "error" && (
          <p className={formStyles.failure} role="alert">
            Workshops could not be loaded. Please try again.
          </p>
        )}
        {listStatus === "ready" && workshops.length === 0 && (
          <p className={styles.hint}>No workshops yet. Create the first one above.</p>
        )}
        <ul className={styles.list}>
          {workshops.map((workshop) => {
            const { display, zone } = describeInstant(workshop.startsAt);
            const isDetailsOpen = detailsId === workshop.id;
            const isConfirmOpen = confirmId === workshop.id;
            return (
              <li key={workshop.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{workshop.title}</p>
                  <p className={styles.rowMeta}>
                    {display} ({zone}) &middot; {workshop.topic}
                  </p>
                </div>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    aria-expanded={isDetailsOpen}
                    onClick={() => setDetailsId(isDetailsOpen ? null : workshop.id)}
                  >
                    {isDetailsOpen ? "Hide details" : "View details"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={() => startEdit(workshop)}
                    disabled={pending}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerAction}
                    aria-expanded={isConfirmOpen}
                    onClick={() => setConfirmId(isConfirmOpen ? null : workshop.id)}
                    disabled={pending}
                  >
                    Delete
                  </button>
                </div>
                {isDetailsOpen && (
                  <dl className={styles.details}>
                    <div>
                      <dt>Description</dt>
                      <dd>{workshop.description}</dd>
                    </div>
                    <div>
                      <dt>Starts at (stored)</dt>
                      <dd>{workshop.startsAt}</dd>
                    </div>
                    <div>
                      <dt>Duration</dt>
                      <dd>{workshop.durationMinutes} minutes</dd>
                    </div>
                    <div>
                      <dt>Format</dt>
                      <dd>{workshop.format === "online" ? "Online" : "In person"}</dd>
                    </div>
                    <div>
                      <dt>Location or meeting URL</dt>
                      <dd>{workshop.location}</dd>
                    </div>
                    <div>
                      <dt>Registration URL</dt>
                      <dd>{workshop.registrationUrl || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>ID</dt>
                      <dd>{workshop.id}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{workshop.createdAt}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>{workshop.updatedAt}</dd>
                    </div>
                  </dl>
                )}
                {isConfirmOpen && (
                  <div className={styles.confirm} role="alertdialog" aria-label="Confirm deletion">
                    <p>
                      Delete &ldquo;{workshop.title}&rdquo;? This cannot be
                      undone.
                    </p>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.dangerAction}
                        onClick={() => handleDelete(workshop.id)}
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
