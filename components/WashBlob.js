import styles from "./WashBlob.module.css";

export default function WashBlob({ color = "var(--wc-indigo)" }) {
  return (
    <svg className={styles.blob} viewBox="0 0 200 90" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="45" rx="88" ry="30" fill={color} filter="url(#wc-bleed)" />
    </svg>
  );
}
