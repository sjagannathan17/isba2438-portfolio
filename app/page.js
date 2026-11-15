"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import ConceptualVisual from "@/components/ConceptualVisual";
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

const firstSentence = (text) => `${text.split(". ")[0].replace(/\.$/, "")}.`;

const visualVariants = {
  "flex-competitive-intelligence": "flex",
  "agri-intelligence-platform": "agri",
};

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
  const [highlight, setHighlight] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <article>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Srinidhi Jagannathan</p>
          <h1 className={styles.headline}>From complex systems to products people can use.</h1>
          <p className={styles.heroLine}>
            Electrical engineer by training, I moved interbank settlement from up to 5
            days to real time before coming to Santa Clara to build AI products.
          </p>
          <p className={styles.heroIntro}>
            I have shipped payment systems across three island nations and AI products
            from prototype to launch.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink href="/contact-me" variant="primary">
              Get in touch
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Explore my work
            </ButtonLink>
            <a
              className={styles.resumeLink}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>
        </div>
        <div className={styles.heroMap}>
          <WorldMap
            mapSvg={dottedMapSvg}
            pins={pinsWithPositions}
            pathD={journeyPathD}
            viewBox={mapViewBox}
            selectedId={selectedPin}
            onSelectPin={setSelectedPin}
            highlightIds={highlight ?? (selectedPin ? [selectedPin] : null)}
          />
          <div className={styles.chaptersWrap}>
            <p className={styles.mapHint} id="journey-instructions">
              Select a location to explore my journey.
            </p>
            <div
              className={styles.chapters}
              role="group"
              aria-labelledby="journey-instructions"
            >
              {pins.map((pin) => {
                const selected = selectedPin === pin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    className={
                      selected ? `${styles.chapter} ${styles.chapterActive}` : styles.chapter
                    }
                    aria-pressed={selected}
                    onClick={() => setSelectedPin(selected ? null : pin.id)}
                  >
                    {pin.place}
                  </button>
                );
              })}
            </div>
          </div>
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
            <div className={styles.featureMedia}>
              <div className={styles.featurePanel}>
                <ConceptualVisual variant={visualVariants[project.slug]} />
              </div>
              <p className={styles.featureCaption}>
                {project.impact}. Conceptual illustration, not a product screenshot.
              </p>
            </div>
            <div className={styles.featureBody}>
              <h2 className={styles.featureName}>{project.name}</h2>
              <p className={styles.featureRow}>
                <span className={styles.featureLabel}>The problem</span>
                {firstSentence(project.why)}
              </p>
              <p className={styles.featureRow}>
                <span className={styles.featureLabel}>{project.roleLabel}</span>
                {firstSentence(project.role)}
              </p>
              {project.recognition ? (
                <p className={styles.featureRow}>
                  <span className={styles.featureLabel}>Recognition</span>
                  {project.recognition}
                </p>
              ) : null}

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
          <ButtonLink href="/contact-me" variant="cream">
            Get in touch
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}
