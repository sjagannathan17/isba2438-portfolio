import CompassIcon from "@/components/CompassIcon";
import ButtonLink from "@/components/ButtonLink";
import styles from "./about-me.module.css";

export const metadata = {
  title: "About Me",
};

const education = [
  {
    school: "Santa Clara University, Leavey School of Business",
    detail:
      "M.S. in Business Analytics, Data Science & AI track, graduating December 2026",
  },
  {
    school: "SSN College of Engineering, Chennai",
    detail: "B.E. in Electrical & Electronics Engineering",
  },
];

const experience = [
  {
    role: "AI Product Manager, Flex industry practicum",
    org: "Santa Clara University, January 2026 to present",
    detail:
      "I defined the scope and led delivery of an AI platform for competitor analysis, and built the NLP and RAG pipelines behind it.",
  },
  {
    role: "Graduate Teaching Assistant",
    org: "Santa Clara University, January 2026 to present",
    detail:
      "TA for Operations & Supply Chain and Supply Chain Finance, mentoring 60+ graduate students.",
  },
  {
    role: "Associate Engineer, then Engineer, Product & Release",
    org: "iGreenData (a Synechron company), Bengaluru, 2021 to 2024",
    detail:
      "In fintech, I led go-live of RTGS and ACH payment systems in Samoa, Fiji, and Vanuatu, moving interbank settlement from up to 5 days to real time. Built dashboards tracking 50+ KPIs across 12 institutions.",
  },
];

const skills = [
  { group: "Code and data", items: ["Python", "SQL", "R", "JavaScript", "Pandas", "scikit-learn", "PyTorch", "XGBoost"] },
  { group: "AI", items: ["RAG", "LLMs", "multi-agent systems", "LangGraph", "LangChain", "ChromaDB", "FAISS", "model and LLM evaluation"] },
  { group: "Product", items: ["PRDs", "roadmapping", "user research", "A/B testing", "stakeholder management", "Agile", "Figma", "Jira"] },
  { group: "Build and visualize", items: ["FastAPI", "Next.js", "Streamlit", "Tableau", "Power BI", "Gurobi"] },
];

export default function AboutMe() {
  return (
    <article>
      <p className="pageIcon">
        <CompassIcon />
      </p>
      <h1>About Me</h1>
      <p className={styles.intro}>
        Srinidhi Jagannathan, an AI builder and product manager, and an MS in Business
        Analytics student at Santa Clara University.
      </p>

      <section className={styles.section}>
        <h2>Experience</h2>
        {experience.map((entry) => (
          <div key={entry.role} className={styles.entry}>
            <h3>{entry.role}</h3>
            <p className={styles.org}>{entry.org}</p>
            <p>{entry.detail}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>Education</h2>
        {education.map((entry) => (
          <div key={entry.school} className={styles.entry}>
            <h3>{entry.school}</h3>
            <p>{entry.detail}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>Skills</h2>
        {skills.map((group) => (
          <div key={group.group} className={styles.skillGroup}>
            <h3>{group.group}</h3>
            <ul className={styles.chips}>
              {group.items.map((item) => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>What I&rsquo;m looking for</h2>
        <p>
          Associate or early-career Product Manager roles in AI and fintech, full-time,
          starting after December 2026. Open to relocating anywhere in the US.
        </p>
        <ButtonLink href="/contact-me-server-form">Get in touch</ButtonLink>
      </section>
    </article>
  );
}
