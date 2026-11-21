"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./AdminNav.module.css";

const areas = [
  { href: "/admin", label: "Admin home" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/workshops", label: "Workshops" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blogs", label: "Blog" },
];

export default function AdminNav({ current }) {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.refresh();
  }

  return (
    <nav aria-label="Admin navigation" className={styles.bar}>
      <ul className={styles.links}>
        {areas.map((area) => (
          <li key={area.href}>
            <Link
              href={area.href}
              className={`${styles.link} ${current === area.href ? styles.current : ""}`}
              aria-current={current === area.href ? "page" : undefined}
            >
              {area.label}
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.signOut} onClick={signOut}>
        Sign out
      </button>
    </nav>
  );
}
