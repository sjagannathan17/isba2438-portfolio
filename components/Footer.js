import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.name}>Srinidhi Jagannathan</p>
          <p className={styles.coords}>37.35° N, 121.96° W · Santa Clara, CA</p>
        </div>
        <ul className={styles.links}>
          <li>
            <a
              href="https://www.linkedin.com/in/srinidhi-jagannathan"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/sjagannathan17" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
