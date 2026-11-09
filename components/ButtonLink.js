import Link from "next/link";
import styles from "./ButtonLink.module.css";

export default function ButtonLink({ href, children, variant = "primary" }) {
  const className = variant === "primary" ? styles.primary : styles.secondary;
  return (
    <Link href={href} className={`${styles.button} ${className}`}>
      {children}
    </Link>
  );
}
