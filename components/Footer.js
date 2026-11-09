import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.name}>Srinidhi Jagannathan</p>
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
