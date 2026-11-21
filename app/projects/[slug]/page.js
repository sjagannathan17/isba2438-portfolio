import NextStep from "@/components/NextStep";
import PageHeader from "@/components/PageHeader";
import ButtonLink from "@/components/ButtonLink";
import ConceptualVisual from "@/components/ConceptualVisual";
import { readProjects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import styles from "./project.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let project = null;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    project = null;
  }
  return {
    title: project ? project.name : "Project not found",
  };
}

const visualVariants = {
  "flex-competitive-intelligence": "flex",
  "agri-intelligence-platform": "agri",
};

export default async function ProjectPage({ params }) {
  const { slug } = await params;

  let project = null;
  let storageError = false;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    storageError = true;
  }

  if (storageError) {
    return (
      <article>
        <PageHeader label="Project" title="Project unavailable">
          Project storage is temporarily unavailable. Please try again soon.
        </PageHeader>
      </article>
    );
  }

  if (!project) {
    notFound();
  }

  const others = (await readProjects()).filter(
    (candidate) => candidate.slug !== project.slug
  );
  const other = others.length > 0 ? others[0] : null;

  return (
    <article>
      <PageHeader label={project.tag} title={project.name}>
        {project.blurb}
      </PageHeader>

      <section className={styles.summary} aria-label="Role, timeframe, and setting">
        <div className={styles.summaryRow}>
          <div>
            <span>Role</span>
            <p>{project.roleSummary}</p>
          </div>
          <div>
            <span>Timeframe</span>
            <p>{project.timeframe}</p>
          </div>
          <div>
            <span>Setting</span>
            <p>{project.context}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>The problem</h2>
        <p>{project.why}</p>
      </section>

      <section className={styles.section}>
        <h2>My contribution</h2>
        <p>{project.contribution}</p>
      </section>

      <section className={styles.section}>
        <h2>How the product works</h2>
        <p>{project.summary}</p>
        <div className={styles.visualWrap}>
          <div className={styles.visualPanel}>
            <ConceptualVisual variant={visualVariants[project.slug]} />
          </div>
          <p className={styles.visualCaption}>
            Conceptual illustration, not a product screenshot.
          </p>
        </div>
        <p className={styles.techLine}>
          <span>Built with</span> {project.tech.join(", ")}
        </p>
      </section>

      <section className={styles.section}>
        <h2>The outcome</h2>
        <p className={styles.outcome}>{project.impact}.</p>
        {project.recognition ? <p>{project.recognition}</p> : null}
        <p className={styles.repoLink}>
          <ButtonLink href={project.link.url} variant="secondary" target="_blank" rel="noreferrer">
            {project.link.label}
          </ButtonLink>
        </p>
      </section>

      {other && (
        <NextStep href={`/projects/${other.slug}`}>Next project: {other.name}</NextStep>
      )}
      <NextStep href="/projects">All projects</NextStep>
    </article>
  );
}
