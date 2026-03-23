import type { SongCredit } from "@/types";

interface SongCreditsProps {
  credits: SongCredit[];
}

export function SongCredits({ credits }: SongCreditsProps): React.ReactElement {
  return (
    <dl className="space-y-2">
      {credits.map((credit, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-1">
          <dt className="text-muted-foreground flex-shrink-0 sm:w-48">
            {credit.key}:
          </dt>
          <dd>{credit.value}</dd>
        </div>
      ))}
    </dl>
  );
}
