import NextStep from "@/components/NextStep";
import PageHeader from "@/components/PageHeader";
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
  const other = projects.find((candidate) => candidate.slug !== project.slug);

  const roleSentences = project.role.split(". ").map((s) => s.replace(/\.$/, ""));

  return (
    <article>
      <PageHeader label={project.tag} title={project.name}>
        {project.place} · {project.coords}
      </PageHeader>

      <section className={styles.section}>
        <h2>
          Context
        </h2>
        <div className={styles.contextRow}>
          <div>
            <span>Role</span>
            <p>{roleSentences[0]}.</p>
          </div>
          <div>
            <span>Timeframe</span>
            <p>{project.year}</p>
          </div>
          <div>
            <span>Setting</span>
            <p>{project.context}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>
          What it does
        </h2>
        <p>{project.summary}</p>
      </section>

      <section className={styles.section}>
        <h2>
          Why it matters
        </h2>
        <p>{project.why}</p>
      </section>

      <section className={styles.section}>
        <h2>
          {project.roleLabel}
        </h2>
        <p>{project.role}</p>
      </section>

      <section className={styles.section}>
        <h2>
          Outcome
        </h2>
        <p className={styles.outcome}>{project.impact}</p>
      </section>

      <section className={styles.section}>
        <h2>
          Tech
        </h2>
        <p className={styles.techLine}>{project.tech.join(", ")}</p>
      </section>

      <p className={styles.repoLink}>
        <a href={project.link.url} target="_blank" rel="noreferrer">
          {project.link.label}
        </a>
      </p>

      <NextStep href={`/projects/${other.slug}`}>Next project: {other.name}</NextStep>
      <NextStep href="/projects">All projects</NextStep>
    </article>
  );
}
