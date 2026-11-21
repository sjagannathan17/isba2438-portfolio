import PageHeader from "@/components/PageHeader";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import ContactAdmin from "@/components/ContactAdmin";

export const metadata = {
  title: "Contact management",
};

export default function AdminContacts() {
  return (
    <AdminGate>
        <AdminNav current="/admin/contacts" />
      <section>
        <PageHeader label="Admin" title="Contact management">
          Review, edit, and delete contact submissions. These records contain
          personal information and are protected by admin sign-in.
        </PageHeader>
        <ContactAdmin />
      </section>
    </AdminGate>
  );
}
