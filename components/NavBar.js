"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About Me" },
  { href: "/projects", label: "Projects" },
  { href: "/contact-me-server-form", label: "Contact Me" },
];

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/projects") {
    return pathname.startsWith("/projects");
  }
  return pathname.startsWith(href);
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.brand}>
          Srinidhi Jagannathan
        </Link>
        <ul className={styles.links}>
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={active ? `${styles.link} ${styles.active}` : styles.link}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
