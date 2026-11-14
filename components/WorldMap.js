"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getJourneyFractions, getLatLngFromPosition } from "@/lib/dottedMap";
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

export default function WorldMap({ mapSvg, pins, pathD, viewBox, activeYear = "all", highlightIds = null }) {
  const [activeId, setActiveId] = useState(null);
  const [hoverFine, setHoverFine] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef(null);
  const active = pins.find((pin) => pin.id === activeId);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverFine(query.matches);
    const update = (event) => setHoverFine(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      setLoaded(true);
      return;
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
    const timer = setTimeout(() => setLoaded(true), 2600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  function handleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    setCursor({ xPercent, yPercent, ...getLatLngFromPosition(xPercent, yPercent) });
  }

  const fractions = useMemo(
    () =>
      getJourneyFractions(
        pins.map((pin) => ({
          lat: pin.lat + (pin.nudgeLat ?? 0),
          lng: pin.lon + (pin.nudgeLon ?? 0),
        }))
      ),
    [pins]
  );

  const activeIds = useMemo(() => {
    if (highlightIds) {
      return new Set(highlightIds);
    }
    if (activeYear === "all") {
      return null;
    }
    const set = new Set();
    for (const pin of pins) {
      if (pin.years && pin.years.start <= activeYear && activeYear <= pin.years.end) {
        set.add(pin.id);
      }
    }
    return set;
  }, [pins, activeYear, highlightIds]);

  const lastActiveIndex = useMemo(() => {
    if (activeYear === "all") {
      return pins.length - 1;
    }
    let index = -1;
    for (let i = 0; i < pins.length; i++) {
      const { start, end } = pins[i].years ?? {};
      if (start != null && start <= activeYear && activeYear <= end) {
        index = i;
      }
    }
    return index;
  }, [pins, activeYear]);

  const routeOffset = !revealed
    ? 1
    : lastActiveIndex < 0
      ? 1
      : 1 - fractions[lastActiveIndex];

  function toggle(id) {
    setActiveId((current) => (current === id ? null : id));
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setActiveId(null);
    }
  }

  return (
    <figure ref={mapRef} className={styles.mapWrap} onKeyDown={handleKeyDown}>
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
            <path
              d={pathD}
              pathLength="1"
              className={`${styles.drawMask} ${loaded ? styles.drawLoaded : ""}`}
              style={{ strokeDashoffset: routeOffset }}
            />
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
          const dimmed = activeIds ? !activeIds.has(pin.id) : false;
          return (
            <div
              key={pin.id}
              className={`${styles.pinAnchor} ${dimmed ? styles.pinDimmed : ""}`}
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
    </figure>
  );
}
