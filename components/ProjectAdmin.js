"use client";

import { useEffect, useState } from "react";
import ProjectForm from "./ProjectForm";
import formStyles from "./ContactForm.module.css";
import styles from "./WorkshopAdmin.module.css";

const emptyForm = {
  name: "",
  tag: "",
  context: "",
  year: "",
  timeframe: "",
  roleSummary: "",
  blurb: "",
  summary: "",
  why: "",
  contribution: "",
  impact: "",
  recognition: "",
  tech: "",
  linkLabel: "",
  linkUrl: "",
};

function toForm(project) {
  return {
    name: project.name,
    tag: project.tag,
    context: project.context,
    year: project.year,
    timeframe: project.timeframe,
    roleSummary: project.roleSummary,
    blurb: project.blurb,
    summary: project.summary,
    why: project.why,
    contribution: project.contribution,
    impact: project.impact,
    recognition: project.recognition ?? "",
    tech: Array.isArray(project.tech) ? project.tech.join(", ") : "",
    linkLabel: project.link?.label ?? "",
    linkUrl: project.link?.url ?? "",
  };
}

function buildPayload(form) {
  const payload = {
    name: form.name,
    tag: form.tag,
    context: form.context,
    year: form.year,
    timeframe: form.timeframe,
    roleSummary: form.roleSummary,
    blurb: form.blurb,
    summary: form.summary,
    why: form.why,
    contribution: form.contribution,
    impact: form.impact,
    tech: form.tech
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== ""),
    link: { label: form.linkLabel, url: form.linkUrl },
  };
  if (form.recognition.trim() !== "") {
    payload.recognition = form.recognition;
  }
  return payload;
}

export default function ProjectAdmin() {
  const [projects, setProjects] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  async function loadProjects() {
    setListStatus("loading");
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error("failed");
      }
      setProjects(Array.isArray(data.projects) ? data.projects : []);
      setListStatus("ready");
    } catch {
      setListStatus("error");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => {
        if (!current[field] && field !== "linkLabel" && field !== "linkUrl") {
          return current;
        }
        const next = { ...current };
        if (field === "linkLabel" || field === "linkUrl") {
          delete next.link;
        } else {
          delete next[field];
        }
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

  function startEdit(project) {
    setEditingId(project.id);
    setForm(toForm(project));
    setErrors({});
    setStatus("idle");
    setNote(null);
    setConfirmId(null);
  }

  async function handleSubmit() {
    if (status === "pending") {
      return;
    }
    setStatus("pending");
    setErrors({});
    setNote(null);
    try {
      const response = await fetch(
        editingId ? `/api/projects/${editingId}` : "/api/projects",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(form)),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        setNote(
          editingId
            ? "Project updated. Public pages reflect it immediately."
            : `Project created at /projects/${data.project?.slug ?? ""}.`
        );
        if (!editingId) {
          setForm(emptyForm);
        }
        await loadProjects();
      } else if (response.status === 400) {
        setStatus("validation");
        setErrors(data.errors ?? { form: "Please check your entries and try again." });
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This project no longer exists. The list below is refreshing.");
        setEditingId(null);
        setForm(emptyForm);
        await loadProjects();
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
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (response.status === 204 || response.status === 200) {
        setStatus("success");
        setNote("Project deleted. Its public page now shows a not-found message.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This project no longer exists. The list below is refreshing.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else {
        setStatus("failure");
        setErrors({ form: "Something went wrong deleting. Please try again." });
      }
      setConfirmId(null);
      await loadProjects();
    } catch {
      setStatus("failure");
      setErrors({ form: "Could not reach the server. Please try again." });
    }
  }

  const pending = status === "pending";

  return (
    <div className={styles.admin}>
      <section className={styles.formSection} aria-labelledby="project-form-heading">
        <h3 id="project-form-heading" className={styles.sectionTitle}>
          {editingId ? "Edit project" : "Create a project"}
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
        <ProjectForm
          values={form}
          onChange={update}
          onSubmit={handleSubmit}
          errors={errors}
          pending={pending}
          submitLabel={editingId ? "Save changes" : "Create project"}
          showCancel={Boolean(editingId)}
          onCancel={startCreate}
        />
      </section>

      <section className={styles.listSection} aria-labelledby="project-list-heading">
        <h3 id="project-list-heading" className={styles.sectionTitle}>
          Existing projects
        </h3>
        {listStatus === "loading" && (
          <p className={styles.hint} role="status">
            Loading projects...
          </p>
        )}
        {listStatus === "error" && (
          <p className={formStyles.failure} role="alert">
            Projects could not be loaded. Please try again.
          </p>
        )}
        {listStatus === "ready" && projects.length === 0 && (
          <p className={styles.hint}>No projects yet. Create the first one above.</p>
        )}
        <ul className={styles.list}>
          {projects.map((project) => {
            const isDetailsOpen = detailsId === project.id;
            const isConfirmOpen = confirmId === project.id;
            return (
              <li key={project.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{project.name}</p>
                  <p className={styles.rowMeta}>
                    {project.tag} &middot; /projects/{project.slug}
                  </p>
                </div>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    aria-expanded={isDetailsOpen}
                    onClick={() => setDetailsId(isDetailsOpen ? null : project.id)}
                  >
                    {isDetailsOpen ? "Hide details" : "View details"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={() => startEdit(project)}
                    disabled={pending}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerAction}
                    aria-expanded={isConfirmOpen}
                    onClick={() => setConfirmId(isConfirmOpen ? null : project.id)}
                    disabled={pending}
                  >
                    Delete
                  </button>
                </div>
                {isDetailsOpen && (
                  <dl className={styles.details}>
                    <div>
                      <dt>Summary</dt>
                      <dd>{project.summary}</dd>
                    </div>
                    <div>
                      <dt>The problem</dt>
                      <dd>{project.why}</dd>
                    </div>
                    <div>
                      <dt>Contribution</dt>
                      <dd>{project.contribution}</dd>
                    </div>
                    <div>
                      <dt>Outcome</dt>
                      <dd>{project.impact}</dd>
                    </div>
                    <div>
                      <dt>Recognition</dt>
                      <dd>{project.recognition || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>Built with</dt>
                      <dd>{Array.isArray(project.tech) ? project.tech.join(", ") : ""}</dd>
                    </div>
                    <div>
                      <dt>Link</dt>
                      <dd>
                        {project.link?.label}: {project.link?.url}
                      </dd>
                    </div>
                    <div>
                      <dt>Public address</dt>
                      <dd>/projects/{project.slug}</dd>
                    </div>
                    <div>
                      <dt>ID</dt>
                      <dd>{project.id}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{project.createdAt}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>{project.updatedAt ?? "Never"}</dd>
                    </div>
                  </dl>
                )}
                {isConfirmOpen && (
                  <div className={styles.confirm} role="alertdialog" aria-label="Confirm deletion">
                    <p>
                      Delete &ldquo;{project.name}&rdquo;? This cannot be
                      undone.
                    </p>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.dangerAction}
                        onClick={() => handleDelete(project.id)}
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
