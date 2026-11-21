import ContactApiForm from "@/components/ContactApiForm";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Me",
};

export default function ContactMe() {
  return (
    <section>
      <PageHeader label="Contact" title="Contact Me">
        Want to talk about AI products, analytics, or a role? Send me a message and I
        will get back to you.
      </PageHeader>
      <div className={styles.grid}>
        <div className={styles.aside}>
          <h2 className={styles.asideTitle}>Direct channels</h2>
          <ul className={styles.channels}>
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
            <li>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                Resume (PDF)
              </a>
            </li>
          </ul>
          <p className={styles.location}>Santa Clara, CA</p>
        </div>
        <div className={styles.main}>
          <ContactApiForm />
        </div>
      </div>
      <div className={styles.demoArea}>
        <p className={styles.demoLabel}>Demo: the original form</p>
        <p className={styles.demoText}>
          The form above posts to an API route. The original version of this form,
          built on a server action, is still available:{" "}
          <Link href="/contact-me-server-form">use the server-action form</Link>. Both
          use the same validation and storage.
        </p>
      </div>
    </section>
  );
}
