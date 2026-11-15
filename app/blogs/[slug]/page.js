import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { readBlogs } from "@/lib/blogs";
import styles from "../blogs.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const posts = await readBlogs();
    const post = posts.find((p) => p.slug === slug);
    return { title: post ? post.title : "Post not found" };
  } catch {
    return { title: "Post" };
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params;

  let posts = [];
  let storageError = false;
  try {
    posts = await readBlogs();
  } catch {
    storageError = true;
  }
  const post = posts.find((p) => p.slug === slug);

  if (storageError) {
    return (
      <section>
        <PageHeader label="Blog" title="Post unavailable">
          Blog storage is temporarily unavailable. Please try again soon.
        </PageHeader>
      </section>
    );
  }

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\n{1,}/).filter((p) => p.trim() !== "");
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article>
      <PageHeader label="Blog" title={post.title}>
        {post.description}
      </PageHeader>
      <p className={styles.date}>{date}</p>
      <div className={styles.content}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <p className={styles.back}>
        <Link href="/blogs">All posts</Link>
      </p>
    </article>
  );
}
