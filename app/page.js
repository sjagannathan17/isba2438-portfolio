import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import HeroClock from "@/components/HeroClock";
import HeroCompass from "@/components/HeroCompass";
import JourneyScroll from "@/components/JourneyScroll";
import ProjectCard from "@/components/ProjectCard";
import WorldMap from "@/components/WorldMap";
import { projects } from "@/lib/projects";
import { pins } from "@/lib/journeyPins";
import {
  dottedMapSvg,
  getJourneyFractions,
  getJourneyPathD,
  getPinPosition,
  mapViewBox,
} from "@/lib/dottedMap";
import styles from "./home.module.css";

const journeyLatLngs = pins.map((pin) => ({
  lat: pin.lat + (pin.nudgeLat ?? 0),
  lng: pin.lon + (pin.nudgeLon ?? 0),
}));

const pinsWithPositions = pins.map((pin) => ({
  ...pin,
  position: getPinPosition(pin.lat + (pin.nudgeLat ?? 0), pin.lon + (pin.nudgeLon ?? 0)),
}));

const journeyPathD = getJourneyPathD(journeyLatLngs);
const journeyFractions = getJourneyFractions(journeyLatLngs);

export default function Home() {
  return (
    <article>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <HeroCompass />
          <h1 className={styles.heroName}>Srinidhi Jagannathan</h1>
          <p className={styles.heroIntro}>
            AI builder and product manager, MS Business Analytics at Santa Clara
            University.
          </p>
          <HeroClock />
          <div className={styles.heroActions}>
            <ButtonLink href="/projects" variant="primary">
              View projects
            </ButtonLink>
            <ButtonLink href="/contact-me-server-form" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>
        <div className={styles.heroMap}>
          <WorldMap mapSvg={dottedMapSvg} pins={pinsWithPositions} pathD={journeyPathD} viewBox={mapViewBox} />
        </div>
      </section>

      <section className={styles.stats} aria-label="Career highlights">
        <p className={styles.stat}>
          <span className={styles.statValue}>2.5 years</span>
          <span className={styles.statLabel}>in fintech payments</span>
        </p>
        <p className={styles.stat}>
          <span className={styles.statValue}>MSBA</span>
          <span className={styles.statLabel}>December 2026</span>
        </p>
        <p className={styles.stat}>
          <span className={styles.statValue}>AI and analytics</span>
          <span className={styles.statLabel}>projects</span>
        </p>
      </section>

      <section className={styles.journey}>
        <h2 className={styles.sectionHeading}>Journey</h2>
        <JourneyScroll
          mapSvg={dottedMapSvg}
          pins={pinsWithPositions}
          pathD={journeyPathD}
          viewBox={mapViewBox}
          fractions={journeyFractions}
        />
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
