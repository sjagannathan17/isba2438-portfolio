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
  { href: "/workshops", label: "Workshops" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact-me", label: "Contact Me" },
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
  const menuButtonRef = useRef(null);
  const [indicator, setIndicator] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px)");
    const update = (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link
          href="/"
          className={styles.brand}
          onClick={() => setMenuOpen(false)}
        >
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
        <div className={styles.navEnd}>
          <a
            className={styles.resumeLink}
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <button
            type="button"
            ref={menuButtonRef}
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div id="site-menu" className={styles.mobileMenu}>
          <ul className={styles.mobileList}>
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      active
                        ? `${styles.mobileLink} ${styles.mobileLinkActive}`
                        : styles.mobileLink
                    }
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                className={styles.mobileLink}
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
