"use client";

import { useState } from "react";
import Link from "next/link";
import WorldMap from "@/components/WorldMap";
import { pins } from "@/lib/journeyPins";
import { dottedMapSvg, getPinPosition, getJourneyPathD, getJourneySegmentPaths, mapViewBox } from "@/lib/dottedMap";
import { atlasChapters } from "@/lib/atlasChapters";
import styles from "../app/home.module.css";

const pinsWithPositions = pins.map((pin) => ({
  ...pin,
  position: getPinPosition(pin.lat + (pin.nudgeLat ?? 0), pin.lon + (pin.nudgeLon ?? 0)),
}));

const journeyLatLngs = pins.map((pin) => ({
  id: pin.id,
  lat: pin.lat + (pin.nudgeLat ?? 0),
  lng: pin.lon + (pin.nudgeLon ?? 0),
}));

const journeyPathD = getJourneyPathD(journeyLatLngs);
const journeySegments = getJourneySegmentPaths(journeyLatLngs);

export default function HomeAtlas() {
  const [chapterId, setChapterId] = useState(atlasChapters[0].id);
  const chapter = atlasChapters.find((entry) => entry.id === chapterId);

  return (
    <section className={styles.articleSection} aria-labelledby="atlas-heading">
      <h2 id="atlas-heading" className={styles.label}>
        Journey atlas
      </h2>
      <div className={styles.atlasWrap}>
        <div
          className={styles.chapters}
          role="group"
          aria-label="Atlas chapters"
        >
          {atlasChapters.map((entry) => {
            const selected = chapterId === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                className={
                  selected ? `${styles.chapter} ${styles.chapterActive}` : styles.chapter
                }
                aria-pressed={selected}
                onClick={() => setChapterId(entry.id)}
              >
                <span className={styles.chapterDot} aria-hidden="true" />
                <span className={styles.chapterText}>
                  <span className={styles.chapterPlace}>{entry.shortName}</span>
                </span>
              </button>
            );
          })}
        </div>
        <WorldMap
          mapSvg={dottedMapSvg}
          pins={pinsWithPositions}
          pathD={journeyPathD}
          segments={journeySegments}
          viewBox={mapViewBox}
          selectedId={null}
          highlightIds={[...chapter.pinIds]}
          cardMode="none"
          showLabels
          pinsInteractive={false}
        />
        <div className={styles.atlasPanel} aria-live="polite">
          <p className={styles.panelTitle}>{chapter.title}</p>
          <p className={styles.panelCopy}>{chapter.copy}</p>
          {chapter.stops.length > 0 && (
            <ul className={styles.stopList}>
              {chapter.stops.map((stop) => (
                <li key={stop.place}>
                  <span className={styles.stopKind}>{stop.label}</span>
                  {stop.place}
                </li>
              ))}
            </ul>
          )}
          <p className={styles.panelLinks}>
            {chapter.links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.panelLink}>
                {link.label}{" "}
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
