import CompassIcon from "@/components/CompassIcon";
import { projects, getProject } from "@/lib/projects";
import { notFound } from "next/navigation";
import styles from "./project.module.css";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? project.name : "Project not found",
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <article>
      <p className="pageIcon">
        <CompassIcon />
      </p>
      <p className={styles.tag}>{project.tag}</p>
      <h1>{project.name}</h1>
      <p className={styles.coords}>
        {project.place} · {project.coords}
      </p>

      <section className={styles.section}>
        <h2>What it does</h2>
        <p>{project.summary}</p>
      </section>

      <section className={styles.section}>
        <h2>Why it matters</h2>
        <p>{project.why}</p>
      </section>

      <section className={styles.section}>
        <h2>{project.roleLabel}</h2>
        <p>{project.role}</p>
      </section>

      <section className={styles.section}>
        <h2>Tech</h2>
        <p className={styles.techLine}>{project.tech.join(", ")}</p>
      </section>

      <p className={styles.repoLink}>
        <a href={project.link.url} target="_blank" rel="noreferrer">
          {project.link.label}
        </a>
      </p>
    </article>
  );
}
