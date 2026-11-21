"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setUsername("");
        setPassword("");
        router.refresh();
      } else {
        setError(data.errors?.form ?? "Sign-in failed. Please try again.");
      }
    } catch {
      setError("Could not reach the sign-in service. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.login}>
      <h2 className={styles.heading}>Admin sign-in</h2>
      <p className={styles.lede}>
        These pages manage personal information and are protected. Sign in with
        admin credentials to continue.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-username">
            Username
          </label>
          <input
            id="admin-username"
            className={styles.input}
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={pending}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={pending}
          />
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button className={styles.submit} type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
