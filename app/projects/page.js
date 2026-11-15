import NextStep from "@/components/NextStep";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import styles from "./projects.module.css";

export const metadata = {
  title: "Projects",
};

export default function Projects() {
  return (
    <section>
      <PageHeader label="Work" title="Projects">
        Selected work in AI products and applied machine learning.
      </PageHeader>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <NextStep href="/contact-me">Get in touch</NextStep>
    </section>
  );
}
