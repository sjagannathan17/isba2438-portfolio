import ButtonLink from "@/components/ButtonLink";
import JourneyScroll from "@/components/JourneyScroll";
import ProjectCard from "@/components/ProjectCard";
import PaintedStroke from "@/components/PaintedStroke";
import { projects } from "@/lib/projects";
import { pins } from "@/lib/journeyPins";
import {
  dottedMapDots,
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

const stats = [
  { value: "2.5 years", label: "in fintech payments" },
  {
    value: "3 countries",
    label: "where I helped launch RTGS and ACH payment systems (Fiji, Samoa, Vanuatu)",
  },
  { value: "60+", label: "graduate students mentored as a TA" },
];

export default function Home() {
  return (
    <article>
      <section className={styles.hero}>
        <h1 className={styles.heroName}>Srinidhi Jagannathan</h1>
        <p className={styles.heroIntro}>
          I build AI products and take them from prototype to launch.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="/projects" variant="primary">
            View work
          </ButtonLink>
          <ButtonLink href="/contact-me-server-form" variant="secondary">
            Get in touch
          </ButtonLink>
        </div>
        <p className={styles.scrollCue}>
          Scroll to paint my journey <span aria-hidden="true">&darr;</span>
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>Journey</p>
        <h2 className={styles.sectionHeading}>
          <PaintedStroke color="var(--wc-teal)" />
          Seven places, one journey
        </h2>
        <JourneyScroll
          dots={dottedMapDots}
          pins={pinsWithPositions}
          pathD={journeyPathD}
          viewBox={mapViewBox}
          fractions={journeyFractions}
        />
      </section>

      <section className={styles.section} aria-label="At a glance">
        <p className={styles.label}>At a glance</p>
        <h2 className={styles.sectionHeading}>
          <PaintedStroke color="var(--wc-ochre)" />
          In numbers
        </h2>
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
        <h2 className={styles.sectionHeading}>
          <PaintedStroke color="var(--wc-indigo)" />
          Selected work
        </h2>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.label}>Next</p>
        <h2 className={styles.sectionHeading}>
          <PaintedStroke color="var(--wc-rose)" />
          Let&rsquo;s build something
        </h2>
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
