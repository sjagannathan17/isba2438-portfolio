import ButtonLink from "@/components/ButtonLink";
import ProjectCard from "@/components/ProjectCard";
import WorldMap from "@/components/WorldMap";
import { projects } from "@/lib/projects";
import { pins } from "@/lib/journeyPins";
import { dottedMapSvg, getPinPosition, getJourneyPathD, mapViewBox } from "@/lib/dottedMap";
import styles from "./home.module.css";

const pinsWithPositions = pins.map((pin) => ({
  ...pin,
  position: getPinPosition(pin.lat + (pin.nudgeLat ?? 0), pin.lon + (pin.nudgeLon ?? 0)),
}));

const journeyPathD = getJourneyPathD(
  pins.map((pin) => ({ lat: pin.lat + (pin.nudgeLat ?? 0), lng: pin.lon + (pin.nudgeLon ?? 0) }))
);

const stats = [
  { value: "2.5 years", label: "in fintech payments" },
  { value: "MSBA", label: "December 2026" },
  { value: "AI and analytics", label: "projects" },
];

export default function Home() {
  return (
    <article>
      <section className={styles.hero}>
        <h1 className={styles.heroName}>Srinidhi Jagannathan</h1>
        <p className={styles.heroIntro}>
          AI builder and product manager, MS Business Analytics at Santa Clara
          University.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="/projects" variant="primary">
            View work
          </ButtonLink>
          <ButtonLink href="/contact-me-server-form" variant="secondary">
            Get in touch
          </ButtonLink>
        </div>
      </section>

      <section className={styles.proof} aria-label="Proof">
        <p className={styles.label}>Proof</p>
        <h2 className={styles.sectionHeading}>In numbers</h2>
        <div className={styles.stats}>
          {stats.map((stat) => (
            <p key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </p>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>Work</p>
        <h2 className={styles.sectionHeading}>Selected work</h2>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>Journey</p>
        <h2 className={styles.sectionHeading}>Seven places, one journey</h2>
        <div className={styles.journeyMap}>
          <WorldMap mapSvg={dottedMapSvg} pins={pinsWithPositions} pathD={journeyPathD} viewBox={mapViewBox} />
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>Next</p>
        <h2 className={styles.sectionHeading}>Let&rsquo;s build something</h2>
        <p className={styles.closingIntro}>
          I am looking for associate product manager roles in AI and fintech. If you
          are hiring or want to talk shop, my inbox is open.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="/contact-me-server-form" variant="primary">
            Get in touch
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}
