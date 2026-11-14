import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Project not found",
};

export default function ProjectNotFound() {
  return (
    <section className={styles.wrap}>
      <h1>Project not found</h1>
      <p>
        This page is not on the map. The project may have been renamed, or the address
        may be off by a letter.
      </p>
      <Link href="/projects" className={styles.back}>
        Back to Projects
      </Link>
    </section>
  );
}
