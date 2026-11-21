import NextStep from "@/components/NextStep";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { readProjects } from "@/lib/projects";
import styles from "./projects.module.css";

export const metadata = {
  title: "Projects",
};

export const dynamic = "force-dynamic";

export default async function Projects() {
  let projects = [];
  let storageError = false;
  try {
    projects = await readProjects();
  } catch {
    storageError = true;
  }

  return (
    <section>
      <PageHeader label="Work" title="Projects">
        Selected work in AI products and applied machine learning.
      </PageHeader>
      {storageError ? (
        <p className={styles.storageError} role="alert">
          Projects could not be loaded right now. Please try again soon.
        </p>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
      <NextStep href="/contact-me">Get in touch</NextStep>
    </section>
  );
}
