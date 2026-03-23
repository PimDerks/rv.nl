import Image from "next/image";
import Link from "next/link";

import type { BandMember } from "@/types";

interface BandMemberCardProps {
  member: BandMember;
}

export function BandMemberCard({
  member,
}: BandMemberCardProps): React.ReactElement {
  return (
    <Link
      href={`/about/band/${member.slug}`}
      className="group block"
      data-testid="band-member-card"
    >
      {member.img && (
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
          <Image
            src={member.img}
            alt={member.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      )}
      <h3 className="font-heading font-semibold group-hover:text-foreground/80 transition-colors">
        {member.title}
      </h3>
      {member.role && (
        <p className="text-sm text-muted-foreground">{member.role}</p>
      )}
    </Link>
  );
}
