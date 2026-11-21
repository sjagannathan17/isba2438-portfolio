import ContactForm from "@/components/ContactForm";
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
      <ContactForm />
      <p className="contactAlt">
        This form posts through a server action. The API-backed version is the main
        one: <Link href="/contact-me">use the main contact form</Link>.
      </p>
    </section>
  );
}
