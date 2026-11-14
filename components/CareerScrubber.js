"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CareerScrubber.module.css";

const MIN_YEAR = 2014;
const MAX_YEAR = 2026;
const ALL_VALUE = MIN_YEAR - 1;

function activePinForYear(pins, year) {
  let current = null;
  for (const pin of pins) {
    if (pin.years && pin.years.start <= year && year <= pin.years.end) {
      if (!current || pin.years.start >= current.years.start) {
        current = pin;
      }
    }
  }
  return current;
}

export default function CareerScrubber({ pins, value, onChange }) {
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      return;
    }
    timerRef.current = setInterval(() => {
      const current = valueRef.current;
      const next = current === "all" ? MIN_YEAR : current + 1;
      if (next > MAX_YEAR) {
        setPlaying(false);
        return;
      }
      onChange(next);
    }, 1100);
    return () => clearInterval(timerRef.current);
  }, [playing, onChange]);

  const valueRef = useRef(value);
  valueRef.current = value;

  const sliderValue = value === "all" ? ALL_VALUE : value;

  function handleScrub(event) {
    setPlaying(false);
    const next = Number(event.target.value);
    onChange(next === ALL_VALUE ? "all" : next);
  }

  let caption;
  if (value === "all") {
    caption = "All years: the whole journey, 2014 to today.";
  } else {
    const current = activePinForYear(pins, value);
    caption = current ? `${value}: ${current.doing}` : `${value}: between the chapters on my map.`;
  }

  return (
    <div className={styles.scrubber}>
      <div className={styles.sliderRow}>
        <input
          type="range"
          className={styles.slider}
          min={ALL_VALUE}
          max={MAX_YEAR}
          step={1}
          value={sliderValue}
          aria-label="Explore my career year by year"
          aria-valuetext={value === "all" ? "All years" : String(value)}
          onChange={handleScrub}
        />
        <button
          type="button"
          className={styles.play}
          aria-pressed={playing}
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <div className={styles.ticks} aria-hidden="true">
        <span>All</span>
        {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => (
          <span key={i}>{MIN_YEAR + i}</span>
        ))}
      </div>
      <p className={styles.caption} aria-live="polite">
        {caption}
      </p>
    </div>
  );
}
