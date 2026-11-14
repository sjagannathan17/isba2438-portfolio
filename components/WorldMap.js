"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getLatLngFromPosition } from "@/lib/dottedMap";
import styles from "./WorldMap.module.css";

function cardSide(xPercent) {
  if (xPercent >= 70) {
    return styles.cardRight;
  }
  if (xPercent < 25) {
    return styles.cardLeft;
  }
  return styles.cardCenter;
}

export default function WorldMap({ mapSvg, pins, pathD, viewBox }) {
  const [activeId, setActiveId] = useState(null);
  const [routePaused, setRoutePaused] = useState(false);
  const [hoverFine, setHoverFine] = useState(false);
  const [cursor, setCursor] = useState(null);
  const mapRef = useRef(null);
  const active = pins.find((pin) => pin.id === activeId);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverFine(query.matches);
    const update = (event) => setHoverFine(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function handleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    setCursor({ xPercent, yPercent, ...getLatLngFromPosition(xPercent, yPercent) });
  }

  useEffect(() => {
    const node = mapRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRoutePaused(false);
          observer.disconnect();
        } else {
          setRoutePaused(true);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function toggle(id) {
    setActiveId((current) => (current === id ? null : id));
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setActiveId(null);
    }
  }

  return (
    <figure
      ref={mapRef}
      className={`${styles.mapWrap} ${routePaused ? styles.routePaused : ""}`}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.mapCanvas}
        onMouseMove={hoverFine ? handleMove : undefined}
        onMouseLeave={hoverFine ? () => setCursor(null) : undefined}
      >
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

        {hoverFine && cursor && (
          <div className={styles.crosshair} aria-hidden="true">
            <span className={styles.crossV} style={{ left: `${cursor.xPercent}%` }} />
            <span className={styles.crossH} style={{ top: `${cursor.yPercent}%` }} />
            <span
              className={`${styles.crossLabel} ${cursor.xPercent > 65 ? styles.crossLabelLeft : ""} ${
                cursor.yPercent < 18 ? styles.crossLabelBelow : ""
              }`}
              style={{ left: `${cursor.xPercent}%`, top: `${cursor.yPercent}%` }}
            >
              {`${Math.abs(cursor.lat).toFixed(1)}° ${cursor.lat >= 0 ? "N" : "S"}, ${Math.abs(
                cursor.lng
              ).toFixed(1)}° ${cursor.lng >= 0 ? "E" : "W"}`}
            </span>
          </div>
        )}

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
