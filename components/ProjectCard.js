"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./ProjectCard.module.css";

function parseImpact(impact) {
  const match = impact.match(/^([\d,]+)([%+]?)(.*)$/);
  if (!match) {
    return null;
  }
  return {
    target: Number(match[1].replace(/,/g, "")),
    suffix: match[2],
    rest: match[3],
  };
}

function CountValue({ impact }) {
  const parsed = parseImpact(impact);
  const [display, setDisplay] = useState(
    parsed ? parsed.target.toLocaleString("en-US") : impact
  );
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!parsed) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    function run() {
      if (startedRef.current) {
        return;
      }
      startedRef.current = true;
      const start = performance.now();
      const duration = 1100;
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * parsed.target).toLocaleString("en-US"));
        if (t < 1) {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [parsed]);

  if (!parsed) {
    return <>{impact}</>;
  }
  return (
    <span ref={ref}>
      {display}
      {parsed.suffix}
      {parsed.rest}
    </span>
  );
}

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>
      <svg className={styles.wash} viewBox="0 0 200 90" aria-hidden="true" focusable="false">
        <g filter="url(#wc-grain)">
          <ellipse cx="100" cy="45" rx="88" ry="30" fill={project.color} filter="url(#wc-bleed)" />
        </g>
      </svg>
      <span className={styles.postmark}>
        {project.year} · {project.place}
      </span>
      <p className={styles.impact}>
        <CountValue impact={project.impact} />
      </p>
      <p className={styles.tag}>{project.tag}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.blurb}>{project.blurb}</p>
      <p className={styles.more}>Read more &rarr;</p>
    </Link>
  );
}
