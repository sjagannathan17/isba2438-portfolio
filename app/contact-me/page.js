import ContactApiForm from "@/components/ContactApiForm";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

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
      <ContactApiForm />
      <p className="contactAlt">
        Prefer the original form?{" "}
        <Link href="/contact-me-server-form">
          Use the server-action version
        </Link>
        .
      </p>
    </section>
  );
}
