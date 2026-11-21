import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import styles from "./admin.module.css";

export const metadata = {
  title: "Admin",
};

const links = [
  {
    href: "/admin/contacts",
    title: "Contact management",
    description:
      "Review, edit, and delete contact submissions. These records contain personal information.",
  },
  {
    href: "/admin/workshops",
    title: "Workshop management",
    description: "Create, edit, and delete events on the public workshop board.",
  },
  {
    href: "/admin/projects",
    title: "Project management",
    description: "Create, edit, and delete case studies on the public projects pages.",
  },
  {
    href: "/admin/blogs",
    title: "Blog management",
    description: "Write and publish posts to the blog.",
  },
];

export default function AdminLanding() {
  return (
    <AdminGate>
        <AdminNav current="/admin" />
      <section>
        <PageHeader label="Admin" title="Admin">
          Signed in as an administrator. Choose an area to manage.
        </PageHeader>
        <nav aria-label="Admin areas" className={styles.grid}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.card}>
              <h2 className={styles.cardTitle}>{link.title}</h2>
              <p className={styles.cardText}>{link.description}</p>
            </Link>
          ))}
        </nav>
      </section>
    </AdminGate>
  );
}
