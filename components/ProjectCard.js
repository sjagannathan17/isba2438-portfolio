import Link from "next/link";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>
      <p className={styles.tag}>{project.tag}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.blurb}>{project.blurb}</p>
      <p className={styles.more}>Read more &rarr;</p>
    </Link>
  );
}
