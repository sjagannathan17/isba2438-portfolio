"use client";

import { useEffect, useState } from "react";
import styles from "./HeroClock.module.css";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Los_Angeles",
});

export default function HeroClock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    function tick() {
      setTime(formatter.format(new Date()));
    }
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={styles.line}>
      37.35° N, 121.96° W · Santa Clara
      <span aria-hidden="true"> · </span>
      <span>{time ?? "--:--"}</span>
    </p>
  );
}
