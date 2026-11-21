"use client";

import { useCallback, useEffect, useState } from "react";
import WorkshopCard from "./WorkshopCard";
import formStyles from "./ContactForm.module.css";
import styles from "./WorkshopBoard.module.css";

export default function WorkshopBoard() {
  const [workshops, setWorkshops] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetch("/api/workshops")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }
        setWorkshops(Array.isArray(data.workshops) ? data.workshops : []);
        setStatus("ready");
      })
      .catch(() => {
        if (active) {
          setStatus("error");
        }
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (status === "loading") {
    return (
      <p className={styles.note} role="status">
        Loading workshops...
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.note}>
        <p className={formStyles.failure} role="alert">
          Workshops could not be loaded. Please try again.
        </p>
        <button type="button" className={styles.retry} onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  const now = Date.now();
  const upcoming = workshops
    .filter((workshop) => Date.parse(workshop.startsAt) >= now)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const past = workshops
    .filter((workshop) => Date.parse(workshop.startsAt) < now)
    .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));

  if (workshops.length === 0) {
    return (
      <p className={styles.note} role="status">
        No workshops are scheduled yet. Check back soon, or reach out if you
        want to talk about a session.
      </p>
    );
  }

  return (
    <div className={styles.board}>
      <section aria-labelledby="upcoming-heading">
        <h3 id="upcoming-heading" className={styles.groupHeading}>
          Upcoming
        </h3>
        {upcoming.length === 0 ? (
          <p className={styles.note}>Nothing scheduled right now.</p>
        ) : (
          <div className={styles.grid}>
            {upcoming.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        )}
      </section>
      {past.length > 0 && (
        <section aria-labelledby="past-heading">
          <h3 id="past-heading" className={styles.groupHeading}>
            Past events
          </h3>
          <div className={styles.grid}>
            {past.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
