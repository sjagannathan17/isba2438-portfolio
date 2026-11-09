import CompassIcon from "@/components/CompassIcon";

export const metadata = {
  title: "About Me",
};

export default function AboutMe() {
  return (
    <section>
      <p className="pageIcon">
        <CompassIcon />
      </p>
      <h1>About Me</h1>
      <p>
        Placeholder page. My story, education, experience, skills, and what I am looking
        for arrive in the next step.
      </p>
    </section>
  );
}
