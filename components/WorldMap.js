"use client";

import Link from "next/link";
import { useState } from "react";
import { pins, projectX, projectY } from "@/lib/journeyPins";
import { landmasses, landPath } from "@/lib/worldLand";
import styles from "./WorldMap.module.css";

function cardSide(xPercent) {
  if (xPercent > 75) {
    return styles.cardRight;
  }
  if (xPercent < 25) {
    return styles.cardLeft;
  }
  return styles.cardCenter;
}

export default function WorldMap() {
  const [activeId, setActiveId] = useState(null);
  const active = pins.find((pin) => pin.id === activeId);

  function toggle(id) {
    setActiveId((current) => (current === id ? null : id));
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setActiveId(null);
    }
  }

  return (
    <div className={styles.mapWrap} onKeyDown={handleKeyDown}>
      <svg
        className={styles.map}
        viewBox="0 0 360 180"
        role="img"
        aria-label="World map showing the places in my journey"
      >
        <g className={styles.graticule} aria-hidden="true">
          {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={180} />
          ))}
          {[30, 60, 120, 150].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={360} y2={y} />
          ))}
          <line className={styles.equator} x1={0} y1={90} x2={360} y2={90} />
        </g>
        <g className={styles.land} aria-hidden="true">
          {landmasses.map((landmass) => (
            <path key={landmass.name} d={landPath(landmass.points)} />
          ))}
        </g>
      </svg>

      {pins.map((pin) => {
        const x = projectX(pin.lon);
        const y = projectY(pin.lat);
        const isActive = pin.id === activeId;
        return (
          <div
            key={pin.id}
            className={styles.pinAnchor}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <button
              type="button"
              className={isActive ? `${styles.pinButton} ${styles.pinActive}` : styles.pinButton}
              aria-expanded={isActive}
              aria-controls={`pin-card-${pin.id}`}
              aria-label={`${pin.place}, ${pin.dates}`}
              onClick={() => toggle(pin.id)}
            >
              <span className={styles.pinDot} aria-hidden="true" />
            </button>
            <span className={`${styles.pinLabel} ${pin.labelSide === "left" ? styles.labelLeft : ""}`} aria-hidden="true">
              {pin.place}
            </span>
            {isActive && (
              <div
                id={`pin-card-${pin.id}`}
                className={`${styles.card} ${cardSide(x)}`}
                role="group"
                aria-label={pin.place}
              >
                <p className={styles.cardPlace}>{pin.place}</p>
                <p className={styles.cardDates}>{pin.dates}</p>
                <p className={styles.cardText}>{pin.text}</p>
                <Link href={pin.href} className={styles.cardLink}>
                  {pin.linkLabel}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
