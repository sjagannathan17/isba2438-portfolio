"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogPostForm from "./BlogPostForm";
import formStyles from "./ContactForm.module.css";
import styles from "./WorkshopAdmin.module.css";

const emptyForm = { title: "", description: "", content: "" };

function formatDate(iso) {
  if (!iso) {
    return "Unknown";
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState(null);
  const [noteLink, setNoteLink] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  async function loadPosts() {
    setListStatus("loading");
    try {
      const response = await fetch("/api/blogs", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error("failed");
      }
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setListStatus("ready");
    } catch {
      setListStatus("error");
    }
  }

  useEffect(() => {
    loadPosts();
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
    setNoteLink(null);
  }

  function startEdit(post) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      description: post.description,
      content: post.content,
    });
    setErrors({});
    setStatus("idle");
    setNote(null);
    setNoteLink(null);
    setConfirmId(null);
  }

  async function handleSubmit() {
    if (status === "pending") {
      return;
    }
    setStatus("pending");
    setErrors({});
    setNote(null);
    setNoteLink(null);
    try {
      const response = await fetch(
        editingId ? `/api/blogs/${editingId}` : "/api/blogs",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        if (editingId) {
          setNote("Post updated. The public page reflects it immediately.");
        } else {
          setNote("Post published!");
          setNoteLink({ slug: data.slug, title: form.title.trim() });
        }
        if (!editingId) {
          setForm(emptyForm);
        }
        await loadPosts();
      } else if (response.status === 400) {
        setStatus("validation");
        setErrors(data.errors ?? { form: "Please check your entries and try again." });
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This post no longer exists. The list below is refreshing.");
        setEditingId(null);
        setForm(emptyForm);
        await loadPosts();
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
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (response.status === 204 || response.status === 200) {
        setStatus("success");
        setNote("Post deleted. Its public page now shows a not-found message.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else if (response.status === 404) {
        setStatus("failure");
        setNote("This post no longer exists. The list below is refreshing.");
        if (wasEditing) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else {
        setStatus("failure");
        setErrors({ form: "Something went wrong deleting. Please try again." });
      }
      setConfirmId(null);
      await loadPosts();
    } catch {
      setStatus("failure");
      setErrors({ form: "Could not reach the server. Please try again." });
    }
  }

  const pending = status === "pending";

  return (
    <div className={styles.admin}>
      <section className={styles.formSection} aria-labelledby="blog-form-heading">
        <h3 id="blog-form-heading" className={styles.sectionTitle}>
          {editingId ? "Edit post" : "Write a new post"}
        </h3>
        <BlogPostForm
          values={form}
          onChange={update}
          onSubmit={handleSubmit}
          errors={errors}
          pending={pending}
          submitLabel={editingId ? "Save changes" : "Publish post"}
          successNote={
            note ? (
              noteLink ? (
                <>
                  {note}{" "}
                  <Link href={`/blogs/${noteLink.slug}`}>
                    View &ldquo;{noteLink.title}&rdquo;
                  </Link>
                </>
              ) : (
                note
              )
            ) : null
          }
          failureNote={
            status === "failure" && note ? note : null
          }
          showCancel={Boolean(editingId)}
          onCancel={startCreate}
        />
      </section>

      <section className={styles.listSection} aria-labelledby="blog-list-heading">
        <h3 id="blog-list-heading" className={styles.sectionTitle}>
          Existing posts
        </h3>
        {listStatus === "loading" && (
          <p className={styles.hint} role="status">
            Loading posts...
          </p>
        )}
        {listStatus === "error" && (
          <p className={formStyles.failure} role="alert">
            Posts could not be loaded. Please try again.
          </p>
        )}
        {listStatus === "ready" && posts.length === 0 && (
          <p className={styles.hint}>No posts yet. Publish the first one above.</p>
        )}
        <ul className={styles.list}>
          {posts.map((post) => {
            const isDetailsOpen = detailsId === post.id;
            const isConfirmOpen = confirmId === post.id;
            return (
              <li key={post.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{post.title}</p>
                  <p className={styles.rowMeta}>
                    {post.description} &middot; /blogs/{post.slug}
                  </p>
                </div>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    aria-expanded={isDetailsOpen}
                    onClick={() => setDetailsId(isDetailsOpen ? null : post.id)}
                  >
                    {isDetailsOpen ? "Hide details" : "View details"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={() => startEdit(post)}
                    disabled={pending}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerAction}
                    aria-expanded={isConfirmOpen}
                    onClick={() => setConfirmId(isConfirmOpen ? null : post.id)}
                    disabled={pending}
                  >
                    Delete
                  </button>
                </div>
                {isDetailsOpen && (
                  <dl className={styles.details}>
                    <div>
                      <dt>Content</dt>
                      <dd>{post.content}</dd>
                    </div>
                    <div>
                      <dt>Public address</dt>
                      <dd>/blogs/{post.slug}</dd>
                    </div>
                    <div>
                      <dt>ID</dt>
                      <dd>{post.id}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{formatDate(post.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>{post.updatedAt ? formatDate(post.updatedAt) : "Never"}</dd>
                    </div>
                  </dl>
                )}
                {isConfirmOpen && (
                  <div className={styles.confirm} role="alertdialog" aria-label="Confirm deletion">
                    <p>
                      Delete &ldquo;{post.title}&rdquo;? This cannot be
                      undone.
                    </p>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.dangerAction}
                        onClick={() => handleDelete(post.id)}
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
