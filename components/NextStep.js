import Link from "next/link";
import styles from "./NextStep.module.css";

export default function NextStep({ href, children }) {
  return (
    <p className={styles.wrap}>
      <span className={styles.label}>Next step</span>
      <Link href={href} className={styles.link}>
        {children} &rarr;
      </Link>
    </p>
  );
}
