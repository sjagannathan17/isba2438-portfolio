import CompassIcon from "@/components/CompassIcon";
import ContactForm from "@/components/ContactForm";

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
      <p className="lede">
        Want to talk about AI products, analytics, or a role? Send me a message and I
        will get back to you.
      </p>
      <ContactForm />
    </section>
  );
}
