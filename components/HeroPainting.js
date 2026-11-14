import styles from "./HeroPainting.module.css";

export default function HeroPainting() {
  return (
    <svg
      viewBox="0 0 520 420"
      className={styles.painting}
      role="img"
      aria-label="Hand-painted watercolor washes with ink contour lines and a small compass"
    >
      <g filter="url(#wc-grain)">
        <g filter="url(#wc-bleed)">
          <path
            d="M120 90 C 210 40 340 60 400 140 C 450 205 430 290 340 330 C 250 370 130 340 90 260 C 55 190 60 125 120 90 Z"
            fill="var(--wc-indigo)"
            opacity="0.55"
          />
        </g>
        <g filter="url(#wc-bleed)">
          <path
            d="M180 150 C 260 110 360 130 400 200 C 435 262 390 320 310 335 C 230 350 150 310 135 245 C 122 195 135 175 180 150 Z"
            fill="var(--wc-teal)"
            opacity="0.5"
          />
        </g>
      </g>
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="1.2">
        <path d="M100 250 C 160 210 220 230 260 200 C 300 172 360 180 420 150" />
        <path d="M90 285 C 170 245 240 265 290 235 C 340 207 390 215 445 185" />
        <path d="M150 340 C 210 305 270 315 330 290 C 375 272 410 262 440 245" />
      </g>
      <g transform="translate(96 296)">
        <circle
          r="36"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <line x1="0" y1="-33" x2="0" y2="-26" stroke="var(--ink-soft)" strokeWidth="1.5" />
        <line x1="0" y1="26" x2="0" y2="33" stroke="var(--ink-soft)" strokeWidth="1.5" />
        <line x1="-33" y1="0" x2="-26" y2="0" stroke="var(--ink-soft)" strokeWidth="1.5" />
        <line x1="26" y1="0" x2="33" y2="0" stroke="var(--ink-soft)" strokeWidth="1.5" />
        <path d="M0 -20 L6 5 L0 0 L-6 5 Z" fill="var(--accent)" />
        <path d="M0 20 L6 5 L0 0 L-6 5 Z" fill="var(--ink-soft)" opacity="0.45" />
        <circle r="2.5" fill="var(--accent-strong)" />
      </g>
    </svg>
  );
}
