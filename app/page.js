"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import CareerScrubber from "@/components/CareerScrubber";
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

const firstSentence = (text) => `${text.split(". ")[0]}.`;

const stats = [
  {
    value: "2.5 years",
    label: "in fintech payments",
    relatedPins: ["bengaluru", "singapore", "australia"],
  },
  {
    value: "3 countries",
    label: "where I helped launch RTGS and ACH payment systems (Fiji, Samoa, Vanuatu)",
    relatedPins: ["pacific"],
  },
  {
    value: "60+",
    label: "graduate students mentored as a TA",
    relatedPins: ["santa-clara"],
  },
];

export default function Home() {
  const [year, setYear] = useState("all");
  const [highlight, setHighlight] = useState(null);

  return (
    <article>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Srinidhi Jagannathan</p>
          <h1 className={styles.headline}>From complex systems to products people can use.</h1>
          <p className={styles.heroIntro}>
            I have shipped payment systems across three island nations and AI products
            from prototype to launch.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink href="/projects" variant="primary">
              Explore my work
            </ButtonLink>
            <ButtonLink href="/contact-me-server-form" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>
        <div className={styles.heroMap}>
          <WorldMap
            mapSvg={dottedMapSvg}
            pins={pinsWithPositions}
            pathD={journeyPathD}
            viewBox={mapViewBox}
            activeYear={year}
            highlightIds={highlight}
          />
          <p className={styles.mapCue}>Click a pin to see what I did there.</p>
          <CareerScrubber pins={pins} value={year} onChange={setYear} />
        </div>
      </section>

      <section className={styles.work} aria-label="Selected work">
        <p className={styles.label}>Selected work</p>
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`${styles.feature} ${index % 2 === 1 ? styles.featureFlip : ""}`}
            onMouseEnter={() => setHighlight(project.relatedPins)}
            onMouseLeave={() => setHighlight(null)}
            onFocus={() => setHighlight(project.relatedPins)}
            onBlur={() => setHighlight(null)}
          >
            <div className={styles.featurePanel} aria-hidden="true">
              <span className={styles.featureImpact}>{project.impact}</span>
            </div>
            <div className={styles.featureBody}>
              <h2 className={styles.featureName}>{project.name}</h2>
              <p className={styles.featureRow}>
                <span className={styles.featureLabel}>The problem</span>
                {firstSentence(project.why)}
              </p>
              <p className={styles.featureRow}>
                <span className={styles.featureLabel}>My role</span>
                {firstSentence(project.role)}
              </p>
              <p className={styles.featureRow}>
                <span className={styles.featureLabel}>Result</span>
                {project.impact}
              </p>
              <span className={styles.featureLink}>
                Explore case study{" "}
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className={styles.impactBand} aria-label="At a glance">
        <p className={styles.label}>At a glance</p>
        <div className={styles.stats}>
          {stats.map((stat) => (
            <p
              key={stat.label}
              className={styles.stat}
              tabIndex={0}
              onMouseEnter={() => setHighlight(stat.relatedPins)}
              onMouseLeave={() => setHighlight(null)}
              onFocus={() => setHighlight(stat.relatedPins)}
              onBlur={() => setHighlight(null)}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </p>
          ))}
        </div>
      </section>

      <section className={styles.closingBand}>
        <p className={styles.label}>Next</p>
        <h2 className={styles.sectionHeading}>
          Let&rsquo;s build something
        </h2>
        <p className={styles.closingIntro}>
          I am looking for associate product manager roles in AI and fintech. If you
          are hiring or want to talk shop, my inbox is open.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="/contact-me-server-form" variant="cream">
            Get in touch
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}
