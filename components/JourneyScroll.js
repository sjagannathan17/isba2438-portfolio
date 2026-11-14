"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./JourneyScroll.module.css";

const ZOOM = 2.4;
const MOBILE_ZOOM = 3;

function clampPercent(value) {
  return Math.min(0, Math.max(100 * (1 - ZOOM), value));
}

function cameraOffset(pin) {
  return {
    x: clampPercent(50 - (pin.position.xPercent * ZOOM) / 2),
    y: clampPercent(50 - (pin.position.yPercent * ZOOM) / 2),
  };
}

export default function JourneyScroll({ mapSvg, pins, pathD, viewBox, fractions }) {
  const [activeId, setActiveId] = useState(pins[0] ? pins[0].id : null);
  const chaptersRef = useRef(null);
  const activeIndex = Math.max(
    0,
    pins.findIndex((pin) => pin.id === activeId)
  );
  const active = pins[activeIndex];
  const offset = active ? cameraOffset(active) : { x: 0, y: 0 };

  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const cropImage = useMemo(
    () => `url("data:image/svg+xml,${encodeURIComponent(mapSvg)}")`,
    [mapSvg]
  );

  useEffect(() => {
    const root = chaptersRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute("data-pin-id"));
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    for (const section of root.querySelectorAll("[data-pin-id]")) {
      observer.observe(section);
    }
    return () => observer.disconnect();
  }, [pins]);

  function goToChapter(pin) {
    const section = document.getElementById(`journey-${pin.id}`);
    if (!section) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function handleFocus(event) {
    const section = event.target.closest("[data-pin-id]");
    if (section) {
      setActiveId(section.getAttribute("data-pin-id"));
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.mapColumn}>
        <div className={styles.mapStage} style={{ aspectRatio: `${vbW} / ${vbH}` }}>
          <div
            className={styles.mapLayer}
            style={{
              transform: `translate(${offset.x}%, ${offset.y}%) scale(${ZOOM})`,
            }}
          >
            <div
              className={styles.mapArt}
              dangerouslySetInnerHTML={{ __html: mapSvg }}
              role="img"
              aria-label="Dotted world map following my journey"
            />
            <svg className={styles.route} viewBox={viewBox} aria-hidden="true">
              <path
                d={pathD}
                pathLength="1"
                style={{
                  strokeDasharray: `${fractions[activeIndex] ?? 1} 1`,
                }}
              />
            </svg>
          </div>
          <div
            className={styles.pinLayer}
            style={{ transform: `translate(${offset.x}%, ${offset.y}%)` }}
          >
            {pins.map((pin, index) => {
              const state =
                index === activeIndex
                  ? styles.pinActive
                  : index < activeIndex
                    ? styles.pinVisited
                    : styles.pinFuture;
              return (
                <button
                  key={pin.id}
                  type="button"
                  className={`${styles.pinButton} ${state}`}
                  style={{
                    left: `${pin.position.xPercent}%`,
                    top: `${pin.position.yPercent}%`,
                  }}
                  aria-label={`Jump to ${pin.place} in the journey`}
                  onClick={() => goToChapter(pin)}
                >
                  <span className={styles.pinDot} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.chapters} ref={chaptersRef} onFocusCapture={handleFocus}>
        {pins.map((pin, index) => (
          <section
            key={pin.id}
            id={`journey-${pin.id}`}
            data-pin-id={pin.id}
            className={styles.chapter}
            aria-labelledby={`journey-${pin.id}-title`}
          >
            <div
              className={styles.crop}
              aria-hidden="true"
              style={{
                backgroundImage: cropImage,
                backgroundSize: `${MOBILE_ZOOM * 100}% auto`,
                backgroundPosition: `${pin.position.xPercent}% ${pin.position.yPercent}%`,
              }}
            />
            <p className={styles.chapterIndex}>
              {`Stop ${index + 1} of ${pins.length}`}
            </p>
            <h3 id={`journey-${pin.id}-title`} className={styles.chapterTitle}>
              {pin.place}
            </h3>
            <p className={styles.chapterDates}>{pin.dates}</p>
            <p className={styles.chapterText}>{pin.text}</p>
            <Link href={pin.href} className={styles.chapterLink}>
              {pin.linkLabel}
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
