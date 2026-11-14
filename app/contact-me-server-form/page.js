import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Contact Me",
};

export default function ContactMe() {
  return (
    <section>
      <PageHeader label="Contact">
        Want to talk about AI products, analytics, or a role? Send me a message and I
        will get back to you.
      </PageHeader>
      <ContactForm />
    </section>
  );
}
