import { describeInstant } from "@/lib/workshopTime";
import styles from "./WorkshopCard.module.css";

export default function WorkshopCard({ workshop }) {
  const { display, zone } = describeInstant(workshop.startsAt);
  const locationIsUrl = /^https?:\/\//i.test(workshop.location);

  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.title}>{workshop.title}</h3>
        <span className={styles.topic}>{workshop.topic}</span>
      </div>
      <p className={styles.when}>
        {display && (
          <>
            <time dateTime={workshop.startsAt}>{display}</time>{" "}
            <span className={styles.zone}>({zone})</span>
          </>
        )}
        <span className={styles.dot} aria-hidden="true">
          &middot;
        </span>
        {workshop.durationMinutes} min
        <span className={styles.dot} aria-hidden="true">
          &middot;
        </span>
        <span className={styles.format}>{workshop.format === "online" ? "Online" : "In person"}</span>
      </p>
      <p className={styles.description}>{workshop.description}</p>
      <p className={styles.location}>
        {locationIsUrl ? (
          <a
            href={workshop.location}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.locationLink}
          >
            {workshop.location}
          </a>
        ) : (
          workshop.location
        )}
      </p>
      {workshop.registrationUrl && (
        <p className={styles.registerRow}>
          <a
            className={styles.registerLink}
            href={workshop.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Register{" "}
            <span className={styles.arrow} aria-hidden="true">&rarr;</span>
          </a>
        </p>
      )}
    </article>
  );
}
