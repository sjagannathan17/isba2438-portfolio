"use client";

import styles from "@/components/ContactForm.module.css";

export default function ProjectForm({
  values,
  onChange,
  onSubmit,
  errors,
  pending,
  submitLabel,
  showCancel,
  onCancel,
  children,
}) {
  const fieldError = (field) =>
    errors[field] ? (
      <p id={`pj-${field}-error`} className={styles.error}>
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
      {children}

      <div className={styles.field}>
        <label htmlFor="pj-name">Project name</label>
        <input
          id="pj-name"
          name="name"
          type="text"
          value={values.name}
          onChange={onChange("name")}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "pj-name-error" : undefined}
        />
        {fieldError("name")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-tag">Tag line</label>
        <input
          id="pj-tag"
          name="tag"
          type="text"
          value={values.tag}
          onChange={onChange("tag")}
          aria-invalid={errors.tag ? "true" : undefined}
          aria-describedby={errors.tag ? "pj-tag-error" : undefined}
        />
        {fieldError("tag")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-context">Setting</label>
        <input
          id="pj-context"
          name="context"
          type="text"
          value={values.context}
          onChange={onChange("context")}
          aria-invalid={errors.context ? "true" : undefined}
          aria-describedby={errors.context ? "pj-context-error" : undefined}
        />
        {fieldError("context")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-year">Year</label>
        <input
          id="pj-year"
          name="year"
          type="text"
          value={values.year}
          onChange={onChange("year")}
          aria-invalid={errors.year ? "true" : undefined}
          aria-describedby={errors.year ? "pj-year-error" : undefined}
        />
        {fieldError("year")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-timeframe">Timeframe</label>
        <input
          id="pj-timeframe"
          name="timeframe"
          type="text"
          value={values.timeframe}
          onChange={onChange("timeframe")}
          aria-invalid={errors.timeframe ? "true" : undefined}
          aria-describedby={errors.timeframe ? "pj-timeframe-error" : undefined}
        />
        {fieldError("timeframe")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-role">Role summary</label>
        <input
          id="pj-role"
          name="roleSummary"
          type="text"
          value={values.roleSummary}
          onChange={onChange("roleSummary")}
          aria-invalid={errors.roleSummary ? "true" : undefined}
          aria-describedby={errors.roleSummary ? "pj-role-error" : undefined}
        />
        {fieldError("roleSummary")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-blurb">Short blurb</label>
        <input
          id="pj-blurb"
          name="blurb"
          type="text"
          value={values.blurb}
          onChange={onChange("blurb")}
          aria-invalid={errors.blurb ? "true" : undefined}
          aria-describedby={errors.blurb ? "pj-blurb-error" : undefined}
        />
        {fieldError("blurb")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-summary">How the product works</label>
        <textarea
          id="pj-summary"
          name="summary"
          rows={4}
          value={values.summary}
          onChange={onChange("summary")}
          aria-invalid={errors.summary ? "true" : undefined}
          aria-describedby={errors.summary ? "pj-summary-error" : undefined}
        />
        {fieldError("summary")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-why">The problem</label>
        <textarea
          id="pj-why"
          name="why"
          rows={3}
          value={values.why}
          onChange={onChange("why")}
          aria-invalid={errors.why ? "true" : undefined}
          aria-describedby={errors.why ? "pj-why-error" : undefined}
        />
        {fieldError("why")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-contribution">My contribution</label>
        <textarea
          id="pj-contribution"
          name="contribution"
          rows={4}
          value={values.contribution}
          onChange={onChange("contribution")}
          aria-invalid={errors.contribution ? "true" : undefined}
          aria-describedby={errors.contribution ? "pj-contribution-error" : undefined}
        />
        {fieldError("contribution")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-impact">The outcome</label>
        <input
          id="pj-impact"
          name="impact"
          type="text"
          value={values.impact}
          onChange={onChange("impact")}
          aria-invalid={errors.impact ? "true" : undefined}
          aria-describedby={errors.impact ? "pj-impact-error" : undefined}
        />
        {fieldError("impact")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-recognition">Recognition (optional)</label>
        <input
          id="pj-recognition"
          name="recognition"
          type="text"
          value={values.recognition}
          onChange={onChange("recognition")}
          aria-invalid={errors.recognition ? "true" : undefined}
          aria-describedby={errors.recognition ? "pj-recognition-error" : undefined}
        />
        {fieldError("recognition")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-tech">Built with (comma-separated)</label>
        <input
          id="pj-tech"
          name="tech"
          type="text"
          value={values.tech}
          onChange={onChange("tech")}
          aria-invalid={errors.tech ? "true" : undefined}
          aria-describedby={errors.tech ? "pj-tech-error" : undefined}
        />
        {fieldError("tech")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-link-label">Link label</label>
        <input
          id="pj-link-label"
          name="linkLabel"
          type="text"
          value={values.linkLabel}
          onChange={onChange("linkLabel")}
          aria-invalid={errors.link ? "true" : undefined}
          aria-describedby={errors.link ? "pj-link-label-error" : undefined}
        />
        {fieldError("link")}
      </div>

      <div className={styles.field}>
        <label htmlFor="pj-link-url">Link URL (http or https)</label>
        <input
          id="pj-link-url"
          name="linkUrl"
          type="url"
          value={values.linkUrl}
          onChange={onChange("linkUrl")}
          aria-invalid={errors.link ? "true" : undefined}
          aria-describedby={errors.link ? "pj-link-url-error" : undefined}
        />
        {fieldError("link")}
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
