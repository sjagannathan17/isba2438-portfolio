"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroCompass.module.css";

export default function HeroCompass() {
  const needleRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let frame = 0;
    function onScroll() {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (needleRef.current) {
          needleRef.current.style.transform = `rotate(${window.scrollY * 0.12}deg)`;
        }
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div className={styles.compass} aria-hidden="true">
      <svg viewBox="0 0 40 40" className={styles.rose}>
        <circle cx="20" cy="20" r="18.5" className={styles.dial} />
        <line x1="20" y1="2.5" x2="20" y2="7" className={styles.tick} />
        <line x1="20" y1="33" x2="20" y2="37.5" className={styles.tick} />
        <line x1="2.5" y1="20" x2="7" y2="20" className={styles.tick} />
        <line x1="33" y1="20" x2="37.5" y2="20" className={styles.tick} />
        <g ref={needleRef} className={styles.needle}>
          <path d="M 20 5.5 L 23 20 L 17 20 Z" className={styles.needleNorth} />
          <path d="M 20 34.5 L 23 20 L 17 20 Z" className={styles.needleSouth} />
        </g>
        <circle cx="20" cy="20" r="1.6" className={styles.hub} />
      </svg>
    </div>
  );
}
