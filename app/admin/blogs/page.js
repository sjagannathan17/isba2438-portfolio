import BlogComposer from "@/components/BlogComposer";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "New post",
};

export default function AdminBlogs() {
  return (
    <section>
      <PageHeader label="Admin" title="New post">
        Write a blog post and publish it to the blog list. Posts appear
        immediately, no restart needed.
      </PageHeader>
      <BlogComposer />
    </section>
  );
}
