import Link from "next/link";
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
            View projects
          </ButtonLink>
          <ButtonLink href="/contact-me-server-form" variant="secondary">
            Get in touch
          </ButtonLink>
        </div>
      </section>

      <section className={styles.journey}>
        <h2 className={styles.sectionHeading}>My journey</h2>
        <WorldMap mapSvg={dottedMapSvg} pins={pinsWithPositions} pathD={journeyPathD} viewBox={mapViewBox} />
      </section>

      <section className={styles.featured}>
        <h2 className={styles.sectionHeading}>Featured projects</h2>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <p className={styles.seeAll}>
          <Link href="/projects">See all projects &rarr;</Link>
        </p>
      </section>
    </article>
  );
}
