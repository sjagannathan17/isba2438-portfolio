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
  const cardRef = useRef(null);
  const tiltRef = useRef(false);

  useEffect(() => {
    tiltRef.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function handleMove(event) {
    if (!tiltRef.current || !cardRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = (x * 2 * 6).toFixed(2);
    const rotateX = (-y * 2 * 6).toFixed(2);
    cardRef.current.style.transform = `translateY(-2px) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleLeave() {
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  }

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.slug}`}
      className={styles.card}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className={styles.stamp}>
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
