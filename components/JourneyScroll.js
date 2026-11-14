"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./JourneyScroll.module.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function JourneyScroll({ dots, pins, pathD, viewBox, fractions }) {
  const [activeId, setActiveId] = useState(pins[0] ? pins[0].id : null);
  const [maxIndex, setMaxIndex] = useState(0);
  const [reduce, setReduce] = useState(false);
  const chaptersRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(query.matches);
    const update = (event) => setReduce(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = chaptersRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-pin-id");
            const index = pins.findIndex((pin) => pin.id === id);
            setActiveId(id);
            setMaxIndex((current) => Math.max(current, index));
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

  const activeIndex = Math.max(
    0,
    pins.findIndex((pin) => pin.id === activeId)
  );
  const paintedCount = reduce ? pins.length : maxIndex + 1;
  const [minX, minY, vbW, vbH] = viewBox.split(" ").map(Number);

  const positioned = pins.map((pin) => {
    const x = minX + (pin.position.xPercent / 100) * vbW;
    const y = minY + (pin.position.yPercent / 100) * vbH;
    return { ...pin, x, y };
  });

  const routeDash = reduce
    ? "1 0"
    : `${fractions[activeIndex] ?? 0} 1`;

  function cropBox(pin) {
    const w = 80;
    const h = 55;
    const x = clamp(pin.x - w / 2, minX, minX + vbW - w);
    const y = clamp(pin.y - h / 2, minY, minY + vbH - h);
    return `${x.toFixed(2)} ${y.toFixed(2)} ${w} ${h}`;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.mapColumn}>
        <div className={styles.mapStage}>
          <svg
            viewBox={viewBox}
            className={styles.map}
            role="img"
            aria-label="Hand-painted map of my journey, filling with color as you read"
          >
            <g dangerouslySetInnerHTML={{ __html: dots }} />
            {positioned.map((pin, index) => (
              <g
                key={`wash-${pin.id}`}
                className={index < paintedCount ? styles.painted : styles.unpainted}
              >
                <g filter="url(#wc-grain)" className={styles.washBlend}>
                  <g filter="url(#wc-bleed)">
                    <ellipse
                      className={styles.washBlob}
                      cx={pin.x.toFixed(2)}
                      cy={pin.y.toFixed(2)}
                      rx="56"
                      ry="34"
                      fill={pin.color}
                    />
                  </g>
                </g>
              </g>
            ))}
            <path
              d={pathD}
              pathLength="1"
              className={styles.route}
              style={{ strokeDasharray: routeDash }}
            />
            {positioned.map((pin, index) => (
              <text
                key={`label-${pin.id}`}
                x={pin.x.toFixed(2)}
                y={(pin.y + pin.labelDy).toFixed(2)}
                textAnchor={pin.labelAnchor}
                className={`${styles.label} ${index < paintedCount ? styles.labelShown : styles.labelHidden}`}
              >
                {pin.place}
              </text>
            ))}
            {positioned.map((pin) => (
              <g key={`marker-${pin.id}`} transform={`translate(${pin.x.toFixed(2)} ${pin.y.toFixed(2)})`}>
                <path
                  d="M0 0 C -2.9 -3.9, -2.9 -7.4, 0 -7.4 C 2.9 -7.4, 2.9 -3.9, 0 0 Z"
                  fill="var(--ink)"
                />
                <circle cx="0" cy="-4.6" r="1.1" fill="var(--paper)" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className={styles.chapters} ref={chaptersRef}>
        {positioned.map((pin, index) => (
          <section
            key={pin.id}
            id={`journey-${pin.id}`}
            data-pin-id={pin.id}
            className={styles.chapter}
            aria-labelledby={`journey-${pin.id}-title`}
          >
            <svg
              className={styles.crop}
              viewBox={cropBox(pin)}
              aria-hidden="true"
              focusable="false"
            >
              <g dangerouslySetInnerHTML={{ __html: dots }} />
              <g filter="url(#wc-grain)" className={styles.washBlend}>
                <g filter="url(#wc-bleed)">
                  <ellipse
                    cx={pin.x.toFixed(2)}
                    cy={pin.y.toFixed(2)}
                    rx="56"
                    ry="34"
                    fill={pin.color}
                  />
                </g>
              </g>
              <g transform={`translate(${pin.x.toFixed(2)} ${pin.y.toFixed(2)})`}>
                <path
                  d="M0 0 C -2.9 -3.9, -2.9 -7.4, 0 -7.4 C 2.9 -7.4, 2.9 -3.9, 0 0 Z"
                  fill="var(--ink)"
                />
                <circle cx="0" cy="-4.6" r="1.1" fill="var(--paper)" />
              </g>
            </svg>
            <p className={styles.chapterIndex}>{`Stop ${index + 1} of ${pins.length}`}</p>
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
