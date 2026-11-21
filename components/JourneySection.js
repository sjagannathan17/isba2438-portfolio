"use client";

import { useState } from "react";
import Link from "next/link";
import WorldMap from "@/components/WorldMap";
import { pins } from "@/lib/journeyPins";
import { dottedMapSvg, getPinPosition, getJourneyPathD, mapViewBox } from "@/lib/dottedMap";
import styles from "./JourneySection.module.css";

const pinsWithPositions = pins.map((pin) => ({
  ...pin,
  position: getPinPosition(pin.lat + (pin.nudgeLat ?? 0), pin.lon + (pin.nudgeLon ?? 0)),
}));

const journeyPathD = getJourneyPathD(
  pins.map((pin) => ({ lat: pin.lat + (pin.nudgeLat ?? 0), lng: pin.lon + (pin.nudgeLon ?? 0) }))
);

export default function JourneySection() {
  const [selectedPin, setSelectedPin] = useState(null);
  const activePin = pins.find((pin) => pin.id === selectedPin) ?? null;

  return (
    <section className={styles.journey} aria-labelledby="journey-heading">
      <h2 id="journey-heading" className={styles.journeyHeading}>
        My journey
      </h2>
      <div className={styles.journeyWrap}>
        <WorldMap
          mapSvg={dottedMapSvg}
          pins={pinsWithPositions}
          pathD={journeyPathD}
          viewBox={mapViewBox}
          selectedId={selectedPin}
          onSelectPin={setSelectedPin}
          highlightIds={selectedPin ? [selectedPin] : null}
          cardMode="none"
          panelId="journey-panel"
        />
        <div id="journey-panel" className={styles.journeyPanel} aria-live="polite">
          {activePin ? (
            <div className={styles.panelBody}>
              <p className={styles.panelPlace}>{activePin.place}</p>
              <p className={styles.panelDates}>{activePin.dates}</p>
              <p className={styles.panelText}>{activePin.text}</p>
              <Link href={activePin.href} className={styles.panelLink}>
                {activePin.linkLabel}
              </Link>
            </div>
          ) : (
            <p className={styles.panelHint}>
              Select a pin on the map, or a location in the timeline, to read
              about that chapter.
            </p>
          )}
        </div>
        <div className={styles.chaptersWrap}>
          <p className={styles.mapHint} id="journey-instructions">
            Choose a location to read about that chapter.
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
                  <span className={styles.chapterDot} aria-hidden="true" />
                  <span className={styles.chapterText}>
                    <span className={styles.chapterPlace}>{pin.shortName}</span>
                    <span className={styles.chapterDates}>{pin.dates}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
