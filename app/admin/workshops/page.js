import PageHeader from "@/components/PageHeader";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import WorkshopAdmin from "@/components/WorkshopAdmin";

export const metadata = {
  title: "Workshop admin",
};

export default function AdminWorkshops() {
  return (
    <AdminGate>
        <AdminNav current="/admin/workshops" />
      <section>
        <PageHeader label="Admin" title="Workshop admin">
          Manage the workshop board. Events appear on the public Workshops page
          immediately, no restart needed. Changes require admin sign-in.
        </PageHeader>
        <WorkshopAdmin />
      </section>
    </AdminGate>
  );
}
