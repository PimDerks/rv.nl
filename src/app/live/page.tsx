import type { Metadata } from "next";

import { splitEventsByDate } from "@/lib/live";
import { generateEventJsonLd } from "@/lib/jsonld";
import { EventTable } from "@/components/content/EventTable";
import { PageHero } from "@/components/layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live",
  description: "Upcoming tour dates and past performances by Robby Valentine.",
};

export default function LivePage(): React.ReactElement {
  const { upcoming, past } = splitEventsByDate();

  return (
    <>
      {upcoming.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateEventJsonLd(upcoming) }}
        />
      )}
      <PageHero
        title="Live"
        subtitle="Valentine performances"
        image="/images/headers/alliance1.jpg"
      >
        <div className="container mx-auto px-4 py-8 md:py-12">
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
      </PageHero>
    </>
  );
}
