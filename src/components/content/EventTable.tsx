import Link from "next/link";
import { ExternalLink, MapPin, Calendar, XCircle, Clock } from "lucide-react";

import { formatDate } from "@/lib/utils";
import type { LiveEvent } from "@/types";

interface EventTableProps {
  events: LiveEvent[];
  title: string;
  emptyMessage?: string;
}

export function EventTable({
  events,
  title,
  emptyMessage = "No events scheduled.",
}: EventTableProps): React.ReactElement {
  // Group past events by year
  const groupedByYear = events.reduce(
    (acc, event) => {
      const year = new Date(event.date).getFullYear().toString();

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(event);

      return acc;
    },
    {} as Record<string, LiveEvent[]>
  );

  const years = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

  if (events.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-bold mb-6">{title}</h2>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="font-heading text-2xl font-bold mb-6">{title}</h2>

      <div className="space-y-8">
        {years.map((year) => (
          <div key={year}>
            {years.length > 1 && (
              <h3 className="font-heading text-lg font-semibold mb-4 text-muted-foreground">
                {year}
              </h3>
            )}
            <div className="space-y-3">
              {groupedByYear[year].map((event) => (
                <div
                  key={event.slug}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-lg border ${
                    event.cancelled
                      ? "bg-destructive/5 border-destructive/20"
                      : event.postponed
                        ? "bg-yellow-500/5 border-yellow-500/20"
                        : "bg-card"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground sm:w-32 flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                    <time>{formatDate(event.date)}</time>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {event.venue}
                      {event.cancelled && (
                        <span className="inline-flex items-center gap-1 text-xs text-destructive">
                          <XCircle className="h-3 w-3" />
                          Cancelled
                        </span>
                      )}
                      {event.postponed && (
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                          <Clock className="h-3 w-3" />
                          Postponed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {event.city}, {event.country}
                    </div>
                    {event.info && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.info}
                      </p>
                    )}
                  </div>

                  {event.url && !event.cancelled && (
                    <Link
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Tickets
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
