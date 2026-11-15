import Link from "next/link";

export const metadata = {
  title: "Post not found",
};

export default function BlogNotFound() {
  return (
    <section>
      <h1>Post not found</h1>
      <p>This post does not exist or may have been removed.</p>
      <p>
        <Link href="/blogs">Browse all posts</Link>.
      </p>
    </section>
  );
}
