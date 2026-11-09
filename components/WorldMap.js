"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function WorldMap({ mapSvg, pins, pathD, viewBox }) {
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
    <figure className={styles.mapWrap} onKeyDown={handleKeyDown}>
      <div className={styles.mapCanvas}>
        <div
          className={styles.mapSvg}
          dangerouslySetInnerHTML={{ __html: mapSvg }}
          role="img"
          aria-label="Dotted world map showing the places in my journey"
        />
        <svg className={styles.journeyPath} viewBox={viewBox} aria-hidden="true">
          <mask id="journey-draw-mask">
            <path d={pathD} pathLength="1" className={styles.drawMask} />
          </mask>
          <path d={pathD} mask="url(#journey-draw-mask)" />
        </svg>

        {pins.map((pin, index) => {
          const isActive = pin.id === activeId;
          return (
            <div
              key={pin.id}
              className={styles.pinAnchor}
              style={{
                left: `${pin.position.xPercent}%`,
                top: `${pin.position.yPercent}%`,
                "--pin-delay": `${0.4 + index * 0.28}s`,
              }}
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
                <span
                  className={`${styles.tooltip} ${pin.labelSide === "left" ? styles.tooltipLeft : ""}`}
                  aria-hidden="true"
                >
                  {pin.place}
                </span>
              </button>
              {isActive && (
                <div
                  id={`pin-card-${pin.id}`}
                  className={`${styles.card} ${cardSide(pin.position.xPercent)}`}
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

      <figcaption className={styles.mapCaption}>Seven places, one journey.</figcaption>
    </figure>
  );
}
