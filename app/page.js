import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import ConceptualVisual from "@/components/ConceptualVisual";
import AskAboutMyWork from "@/components/AskAboutMyWork";
import HomeAtlas from "@/components/HomeAtlas";
import { readProjects } from "@/lib/projects";
import styles from "./home.module.css";

const visualVariants = {
  "flex-competitive-intelligence": "flex",
  "agri-intelligence-platform": "agri",
};

const withPeriod = (text) => (text.endsWith(".") ? text : `${text}.`);

export default async function Home() {
  let projects = [];
  try {
    projects = await readProjects();
  } catch {
    projects = [];
  }

  return (
    <article>
      <section className={styles.hero} aria-label="Introduction">
        <h1 className={styles.name}>Srinidhi Jagannathan</h1>
        <p className={styles.heroIntro}>
          I led RTGS and ACH payment go-lives across Fiji, Samoa, and Vanuatu
          before coming to Santa Clara to build AI products.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="/projects" variant="primary">
            View work
          </ButtonLink>
          <ButtonLink
            href="/resume.pdf"
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </ButtonLink>
          <AskAboutMyWork />
        </div>
      </section>

      <HomeAtlas />

      {projects.length > 0 && (
        <section className={styles.articleSection} aria-labelledby="work-heading">
          <h2 id="work-heading" className={styles.label}>
            Selected work
          </h2>
          <div className={styles.previews}>
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={styles.preview}
              >
                <div className={styles.previewPanel}>
                  <ConceptualVisual variant={visualVariants[project.slug]} />
                </div>
                <p className={styles.previewCaption}>
                  Conceptual illustration, not a product screenshot.
                </p>
                <div className={styles.previewBody}>
                  <h3 className={styles.previewName}>{project.name}</h3>
                  <p className={styles.previewBlurb}>{project.blurb}</p>
                  <p className={styles.previewOutcome}>
                    <span className={styles.featureLabel}>Outcome</span>
                    {withPeriod(project.recognition ?? project.impact)}
                  </p>
                  <span className={styles.featureLink}>
                    Read case study{" "}
                    <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.closingBand}>
        <h2 className={styles.sectionHeading}>Let&rsquo;s build something</h2>
        <p className={styles.closingIntro}>
          I am looking for associate product manager roles in AI and fintech. If
          you are hiring or want to talk shop, my inbox is open.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="/contact-me" variant="primary">
            Get in touch
          </ButtonLink>
          <a
            className={styles.closingLink}
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            className={styles.closingLink}
            href="https://www.linkedin.com/in/srinidhi-jagannathan"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            className={styles.closingLink}
            href="https://github.com/sjagannathan17"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>
    </article>
  );
}
