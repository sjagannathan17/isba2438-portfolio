import CompassIcon from "@/components/CompassIcon";

export const metadata = {
  title: "Contact Me",
};

export default function ContactMe() {
  return (
    <section>
      <p className="pageIcon">
        <CompassIcon />
      </p>
      <h1>Contact Me</h1>
      <p>
        Placeholder page. The server-validated contact form with its success, error, and
        failure states arrives in a later step.
      </p>
    </section>
  );
}
