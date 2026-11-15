"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/blogs/blogs.module.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogsList() {
  const [state, setState] = useState({ status: "loading", posts: [] });

  const load = useCallback(async () => {
    setState({ status: "loading", posts: [] });
    try {
      const response = await fetch("/api/blogs", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setState({ status: "ready", posts: data.posts ?? [] });
    } catch {
      setState({ status: "error", posts: [] });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") {
    return (
      <p className={styles.empty} role="status">
        Loading posts…
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div className={styles.empty} role="alert">
        <p>We could not load the posts right now.</p>
        <button type="button" className={styles.retry} onClick={load}>
          Try again
        </button>
      </div>
    );
  }

  if (state.posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No posts yet.</p>
        <p>
          The first post is one{" "}
          <Link href="/admin/blogs">here</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {state.posts.map((post) => (
        <article key={post.id} className={styles.item}>
          <h2 className={styles.title}>
            <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className={styles.date}>{formatDate(post.createdAt)}</p>
          <p className={styles.description}>{post.description}</p>
          <Link href={`/blogs/${post.slug}`} className={styles.readMore}>
            Read the post <span aria-hidden="true">&rarr;</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
