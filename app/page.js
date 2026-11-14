"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { projects } from "@/lib/projects";
import { pins } from "@/lib/journeyPins";
import { dottedMapSvg, getPinPosition } from "@/lib/dottedMap";
import styles from "./home.module.css";

const stops = ["chennai", "bengaluru", "pacific", "santa-clara", "zambia"].map((id) =>
  pins.find((p) => p.id === id)
);

function sentences(text) {
  return text.split(". ").map((s) => s.replace(/\.$/, ""));
}

export default function Home() {
  const [stop, setStop] = useState(3);
  const active = stops[stop];

  return (
    <article>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          <span aria-hidden="true" /> Srinidhi Jagannathan / Product &amp; AI
        </p>
        <h1 className={styles.headline}>
          Complex systems.
          <br />
          <em>Human outcomes.</em>
        </h1>
        <p className={styles.heroIntro}>
          I turn complex requirements into products people can use, drawing on
          experience delivering national payment systems and building AI-powered
          analyst workflows.
        </p>
        <div className={styles.heroActions}>
          <ButtonLink href="#selected-work" variant="primary">
            Explore my work
          </ButtonLink>
          <ButtonLink href="/contact-me-server-form" variant="secondary">
            Let&rsquo;s talk
          </ButtonLink>
        </div>
        <p className={styles.heroNote}>
          Engineering roots · Product mindset · Santa Clara, CA
        </p>
      </section>

      <section className={styles.work} id="selected-work">
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.label}>01 / Selected work</p>
            <h2>Ideas, made useful.</h2>
          </div>
          <p>
            Two different contexts.
            <br />
            One focus on the people using the product.
          </p>
        </div>
        {projects.map((p, i) => {
          const roleSentences = sentences(p.role);
          const contribution = roleSentences[roleSentences.length - 1];
          return (
            <div key={p.slug} className={`${styles.feature} ${i === 1 ? styles.flip : ""}`}>
              <div className={styles.featureBody}>
                <p className={styles.label}>
                  {`0${i + 1}`} / {p.tag}
                </p>
                <h3>{p.name}</h3>
                <p className={styles.featureSummary}>
                  {i === 0
                    ? "Helping analysts spend less time gathering information and more time understanding it."
                    : "Bringing agricultural information into a familiar, local-language conversation."}
                </p>
                <div className={styles.projectFact}>
                  <span>Context</span>
                  <p>{i === 0 ? "SCU industry practicum · Flex" : "Agricultural AI · Team project"}</p>
                </div>
                <div className={styles.projectFact}>
                  <span>Contribution</span>
                  <p>{contribution}.</p>
                </div>
                {p.recognition ? (
                  <div className={styles.projectFact}>
                    <span>Recognition</span>
                    <p>{p.recognition}</p>
                  </div>
                ) : null}
                <Link className={styles.caseLink} href={`/projects/${p.slug}`}>
                  Inside the project <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      <section className={styles.stats} aria-label="Experience at a glance">
        <div>
          <strong>2.5</strong>
          <span>Years in fintech payments</span>
        </div>
        <div>
          <strong>3</strong>
          <span>National payment-system launches</span>
        </div>
      </section>

      <section className={styles.journey} id="journey">
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.label}>02 / The journey</p>
            <h2>
              Different places.
              <br />
              <em>A connected story.</em>
            </h2>
          </div>
          <p>
            Places I studied, worked, and built for.
            <br />
            Select a chapter to explore.
          </p>
        </div>
        <div className={styles.journeyGrid}>
          <div className={styles.map}>
            <div dangerouslySetInnerHTML={{ __html: dottedMapSvg }} />
            {stops.map((p, i) => {
              const pos = getPinPosition(p.lat, p.lon);
              return (
                <button
                  key={p.id}
                  aria-label={`Show ${p.place}`}
                  aria-pressed={i === stop}
                  onClick={() => setStop(i)}
                  style={{ left: `${pos.xPercent}%`, top: `${pos.yPercent}%` }}
                >
                  <span />
                </button>
              );
            })}
          </div>
          <div className={styles.story} aria-live="polite">
            <p className={styles.label}>
              Chapter {`0${stop + 1}`} / {active.kind}
            </p>
            <h3>{active.place}</h3>
            <p className={styles.storyDates}>{active.dates}</p>
            <p>{active.text}</p>
            <Link href={active.href}>
              {active.linkLabel} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className={styles.milestones} role="group" aria-label="Journey chapters">
          {stops.map((p, i) => (
            <button key={p.id} aria-pressed={stop === i} onClick={() => setStop(i)}>
              <span>{`0${i + 1}`}</span>
              {p.shortName ?? p.place.split(",")[0]}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <p className={styles.label}>Have something in mind?</p>
        <h2>
          Let&rsquo;s make
          <br />
          <em>something matter.</em>
        </h2>
        <div>
          <p>
            Exploring early-career product opportunities
            <br />
            in AI and fintech.
          </p>
          <ButtonLink href="/contact-me-server-form" variant="cream">
            Start a conversation
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}
