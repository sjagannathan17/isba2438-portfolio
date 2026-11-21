import PageHeader from "@/components/PageHeader";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import BlogAdmin from "@/components/BlogAdmin";

export const metadata = {
  title: "Blog management",
};

export default function AdminBlogs() {
  return (
    <AdminGate>
      <AdminNav current="/admin/blogs" />
      <section>
        <PageHeader label="Admin" title="Blog management">
          Write, edit, and delete blog posts. Changes appear on the public blog
          immediately, no restart needed. Publishing requires admin sign-in.
        </PageHeader>
        <BlogAdmin />
      </section>
    </AdminGate>
  );
}
