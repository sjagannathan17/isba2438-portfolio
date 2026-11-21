"use client";

import Link from "next/link";
import styles from "./ProjectCard.module.css";

const firstSentence = (text) => `${text.split(". ")[0].replace(/\.$/, "")}.`;

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.meta}>
        {project.context} · {project.year}
      </p>
      <p className={styles.row}>
        <span className={styles.rowLabel}>The problem</span>
        {firstSentence(project.why)}
      </p>
      <p className={styles.row}>
        <span className={styles.rowLabel}>My contribution</span>
        {project.contribution}
      </p>
      <p className={styles.row}>
        <span className={styles.rowLabel}>The outcome</span>
        {project.impact}
      </p>
      <p className={styles.more}>
        Read the case study <span className={styles.arrow} aria-hidden="true">&rarr;</span>
      </p>
    </Link>
  );
}
