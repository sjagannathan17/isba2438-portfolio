import PaintedStroke from "./PaintedStroke";
import styles from "./PageHeader.module.css";

export default function PageHeader({ label, title, children }) {
  return (
    <header className={styles.header}>
      <p className={styles.label}>{label}</p>
      <h1 className={styles.title}>
        <PaintedStroke color="var(--wc-indigo)" />
        {title}
      </h1>
      {children ? <p className={styles.intro}>{children}</p> : null}
    </header>
  );
}
