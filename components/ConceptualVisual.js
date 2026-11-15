import styles from "./ConceptualVisual.module.css";

export default function ConceptualVisual({ variant }) {
  if (variant === "flex") {
    return (
      <svg
        viewBox="0 0 800 500"
        role="img"
        aria-label="Conceptual diagram: SEC filings, earnings calls, patents, and job posts flowing into an AI analysis panel that answers questions in plain language"
        className={styles.svg}
      >
        <rect width="800" height="500" fill="var(--paper)" />
        {["SEC filings", "Earnings calls", "Patents", "Job posts"].map((source, index) => (
          <g key={source}>
            <rect
              x="56"
              y={70 + index * 100}
              width="220"
              height="64"
              rx="8"
              fill="var(--indigo-50)"
              stroke="var(--indigo-100)"
            />
            <text x="76" y={108 + index * 100} className={styles.label}>
              {source}
            </text>
            <path
              d={`M 276 ${102 + index * 100} C 360 ${102 + index * 100}, 360 250, 436 250`}
              fill="none"
              stroke="var(--indigo-100)"
              strokeWidth="2"
            />
          </g>
        ))}
        <rect x="436" y="150" width="308" height="200" rx="8" fill="var(--indigo-700)" />
        <text x="468" y="210" className={styles.panelTitle}>
          AI analysis
        </text>
        <rect x="468" y="238" width="244" height="12" rx="6" fill="var(--indigo-100)" />
        <rect x="468" y="266" width="196" height="12" rx="6" fill="var(--indigo-100)" />
        <text x="468" y="322" className={styles.panelText}>
          Answers in plain language
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label="Conceptual diagram: risk-based crop advisories delivered by WhatsApp to farmer zones in English, Bemba, and Nyanja"
      className={styles.svg}
    >
      <rect width="800" height="500" fill="var(--paper)" />
      <rect x="56" y="70" width="300" height="360" rx="16" fill="var(--indigo-50)" stroke="var(--indigo-100)" />
      <text x="88" y="130" className={styles.label}>
        WhatsApp advisory
      </text>
      {["English", "Bemba", "Nyanja"].map((language, index) => (
        <g key={language}>
          <rect
            x="88"
            y={160 + index * 72}
            width="200"
            height="52"
            rx="26"
            fill={index === 1 ? "var(--indigo-700)" : "var(--indigo-100)"}
          />
          <text
            x="188"
            y={192 + index * 72}
            textAnchor="middle"
            className={index === 1 ? styles.bubbleOn : styles.bubbleOff}
          >
            {language}
          </text>
        </g>
      ))}
      <text x="404" y="130" className={styles.label}>
        Risk advisory by farmer zone
      </text>
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4, 5].map((column) => {
          const high = (row * 6 + column) % 7 === 0;
          return (
            <circle
              key={`${row}-${column}`}
              cx={420 + column * 56}
              cy={180 + row * 56}
              r="14"
              fill={high ? "var(--indigo-700)" : "var(--indigo-100)"}
            />
          );
        })
      )}
      <circle cx="420" cy="428" r="14" fill="var(--indigo-700)" />
      <text x="448" y="434" className={styles.label}>
        Higher risk this week
      </text>
    </svg>
  );
}
