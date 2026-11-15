import PageHeader from "@/components/PageHeader";
import BlogsList from "@/components/BlogsList";

export const metadata = {
  title: "Blogs",
};

export const dynamic = "force-dynamic";

export default function Blogs() {
  return (
    <section>
      <PageHeader label="Blog" title="Blogs">
        Notes on building AI products, payments, and everything in between.
      </PageHeader>
      <BlogsList />
    </section>
  );
}
