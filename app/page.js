"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import ProductExplorer from "@/components/ProductExplorer";
import { projects } from "@/lib/projects";
import { pins } from "@/lib/journeyPins";
import { dottedMapSvg, getPinPosition } from "@/lib/dottedMap";
import styles from "./home.module.css";

const chapters = [
  {
    id: "chennai",
    number: "01",
    place: "Chennai",
    kind: "Education",
    dates: "2014 to 2018",
    pins: ["chennai"],
    text: "B.E. in Electrical & Electronics Engineering at SSN College of Engineering.",
    href: "/about-me",
    linkLabel: "Read more about me",
  },
  {
    id: "bengaluru",
    number: "02",
    place: "Bengaluru",
    kind: "Employment",
    dates: "2021 to 2024",
    pins: ["bengaluru"],
    text: "About 2.5 years at iGreenData in fintech, payments and data.",
    href: "/about-me",
    linkLabel: "Read more about me",
  },
  {
    id: "asia",
    number: "03",
    place: "Singapore and Australia",
    kind: "Client collaborations",
    dates: "2021 to 2024",
    pins: ["singapore", "australia"],
    text: "Worked with regional teams and clients from the Singapore delivery hub and across Australia on payment systems.",
    href: "/about-me",
    linkLabel: "Read more about me",
  },
  {
    id: "pacific",
    number: "04",
    place: "Pacific islands",
    kind: "Client go-lives",
    dates: "2022 to 2024",
    pins: ["pacific"],
    text: "Led go-live of RTGS and ACH payment systems in Fiji, Samoa, and Vanuatu.",
    href: "/about-me",
    linkLabel: "Read more about me",
  },
  {
    id: "santa-clara",
    number: "05",
    place: "Santa Clara",
    kind: "Study and teaching",
    dates: "2024 to present",
    pins: ["santa-clara"],
    text: "MS Business Analytics at SCU, Graduate TA, Flex practicum.",
    href: "/projects/flex-competitive-intelligence",
    linkLabel: "View the Flex project",
  },
  {
    id: "zambia",
    number: "06",
    place: "Zambia",
    kind: "Team project",
    dates: "2026",
    pins: ["zambia"],
    text: "Agri-Intelligence Platform, a WhatsApp AI system for 22,000+ farmers (team project).",
    href: "/projects/agri-intelligence-platform",
    linkLabel: "View the Agri project",
  },
];

function sentences(text) {
  return text.split(". ").map((s) => s.replace(/\.$/, ""));
}

export default function Home() {
  const [chapter, setChapter] = useState(4);
  const active = chapters[chapter];

  return (
    <article>
      <section className={styles.hero}>
        <div className={styles.heroText}>
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
        </div>

        <div className={styles.heroMap}>
          <div className={styles.map}>
            <div dangerouslySetInnerHTML={{ __html: dottedMapSvg }} />
            {pins.map((p) => {
              const pos = getPinPosition(p.lat, p.lon);
              const isActivePin = active.pins.includes(p.id);
              return (
                <button
                  key={p.id}
                  aria-label={`Show ${p.place}`}
                  aria-pressed={isActivePin}
                  onClick={() => setChapter(chapters.findIndex((c) => c.pins.includes(p.id)))}
                  style={{ left: `${pos.xPercent}%`, top: `${pos.yPercent}%` }}
                >
                  <span />
                </button>
              );
            })}
          </div>
          <div className={styles.story} aria-live="polite">
            <p className={styles.storyLabel}>
              Chapter {active.number} / {active.kind} · {active.dates}
            </p>
            <h2>{active.place}</h2>
            <p className={styles.storyText}>{active.text}</p>
            <Link href={active.href}>
              {active.linkLabel} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className={styles.chapters} role="group" aria-label="Journey chapters">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                aria-pressed={chapter === i}
                onClick={() => setChapter(i)}
              >
                <span>{c.number}</span>
                {c.id === "asia" ? "Asia-Pacific" : c.place}
              </button>
            ))}
          </div>
        </div>
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
              <div className={styles.featureMedia}>
                <ProductExplorer kind={i === 0 ? "flex" : "agri"} />
                <p className={styles.featureCaption}>{p.impact}</p>
              </div>
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
                  <p>{p.context}</p>
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
