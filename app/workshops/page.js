import PageHeader from "@/components/PageHeader";
import WorkshopBoard from "@/components/WorkshopBoard";

export const metadata = {
  title: "Workshops",
};

export default function Workshops() {
  return (
    <section>
      <PageHeader label="Events" title="Workshops">
        Sessions I am running for classmates, mentees, and the community.
        Times are shown in your timezone.
      </PageHeader>
      <WorkshopBoard />
    </section>
  );
}
