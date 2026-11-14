import styles from "./PaintedStroke.module.css";

export default function PaintedStroke({ color = "var(--wc-indigo)" }) {
  return (
    <svg
      className={styles.stroke}
      viewBox="0 0 220 44"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g filter="url(#wc-grain)">
        <path
          filter="url(#wc-bleed)"
          d="M6 26 C 34 18 78 14 116 16 C 154 18 196 20 214 26 C 217 29 214 34 204 37 C 160 43 84 44 40 40 C 18 38 4 33 6 26 Z"
          fill={color}
        />
      </g>
    </svg>
  );
}
