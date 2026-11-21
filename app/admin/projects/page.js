import PageHeader from "@/components/PageHeader";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import ProjectAdmin from "@/components/ProjectAdmin";

export const metadata = {
  title: "Project management",
};

export default function AdminProjects() {
  return (
    <AdminGate>
      <AdminNav current="/admin/projects" />
      <section>
        <PageHeader label="Admin" title="Project management">
          Create, edit, and delete case studies. Changes appear on the public
          pages immediately, no restart needed. Changes require admin sign-in.
        </PageHeader>
        <ProjectAdmin />
      </section>
    </AdminGate>
  );
}
