import type { Metadata } from "next";

import { splitEventsByDate } from "@/lib/live";
import { EventTable } from "@/components/content/EventTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live",
  description: "Upcoming tour dates and past performances by Robby Valentine.",
};

export default function LivePage(): React.ReactElement {
  const { upcoming, past } = splitEventsByDate();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">
        Live Dates
      </h1>

      <EventTable
        events={upcoming}
        title="Upcoming Shows"
        emptyMessage="No upcoming shows scheduled. Check back soon!"
      />

      <EventTable
        events={past}
        title="Past Shows"
        emptyMessage="No past shows recorded."
      />
    </div>
  );
}
