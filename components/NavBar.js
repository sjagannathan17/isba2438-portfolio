"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PinGlyph from "@/components/PinGlyph";
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
  const listRef = useRef(null);
  const linkRefs = useRef([]);
  const [indicator, setIndicator] = useState(null);

  useEffect(() => {
    function measure(animate) {
      const index = links.findIndex((link) => isActive(pathname, link.href));
      const list = listRef.current;
      const link = index !== -1 ? linkRefs.current[index] : null;
      if (!list || !link) {
        setIndicator(null);
        return;
      }
      const linkRect = link.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setIndicator((prev) => ({
        left: linkRect.left - listRect.left,
        top: linkRect.top - listRect.top + linkRect.height - 2,
        width: linkRect.width,
        animate: Boolean(animate && prev),
      }));
    }

    measure(false);
    const handleResize = () => measure(false);
    window.addEventListener("resize", handleResize);
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          measure(true);
        }
      });
    }
    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.brand}>
          <PinGlyph />
          Srinidhi Jagannathan
        </Link>
        <ul
          ref={listRef}
          className={`${styles.links} ${indicator ? styles.linksMeasured : ""}`}
        >
          {links.map((link, index) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  ref={(node) => {
                    linkRefs.current[index] = node;
                  }}
                  className={active ? `${styles.link} ${styles.active}` : styles.link}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {indicator && (
            <span
              aria-hidden="true"
              className={`${styles.indicator} ${indicator.animate ? styles.animate : ""}`}
              style={{
                transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                width: `${indicator.width}px`,
              }}
            />
          )}
        </ul>
      </nav>
    </header>
  );
}
