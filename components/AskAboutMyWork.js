"use client";

import styles from "./AskAboutMyWork.module.css";

export default function AskAboutMyWork() {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles.secondary}`}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("srinidhi:open-assistant"));
      }}
    >
      Ask about my work
    </button>
  );
}
