"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

export default function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          } else {
            setVisible(false);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : styles.hidden} ${className}`}
    >
      {children}
    </div>
  );
}
