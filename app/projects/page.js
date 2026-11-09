import CompassIcon from "@/components/CompassIcon";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import styles from "./projects.module.css";

export const metadata = {
  title: "Projects",
};

export default function Projects() {
  return (
    <section>
      <p className="pageIcon">
        <CompassIcon />
      </p>
      <h1>Projects</h1>
      <p className={styles.lede}>
        Selected work in AI products and applied machine learning.
      </p>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
