import CompassIcon from "@/components/CompassIcon";

export const metadata = {
  title: "Project",
};

export default function ProjectPage() {
  return (
    <section>
      <p className="pageIcon">
        <CompassIcon />
      </p>
      <h1>Project</h1>
      <p>
        Placeholder detail page. Project data from lib/projects.js, notFound() handling,
        and the friendly not-found page arrive in a later step.
      </p>
    </section>
  );
}
