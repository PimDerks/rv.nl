import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface NewsCardProps {
  post: Post;
}

export function NewsCard({ post }: NewsCardProps): React.ReactElement {
  const href = `/news/${post.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded bg-surface shadow-md transition-all duration-700 hover:scale-[1.03] hover:shadow-lg"
      data-testid="news-card"
    >
      {post.img && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={post.img}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <time className="mb-1 font-ui text-xs text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <h3 className="font-display text-lg tracking-wide uppercase text-heading line-clamp-2 transition-colors group-hover:text-foreground">
          {post.title}
        </h3>
        {post.lead && (
          <p className="mt-2 font-body text-sm text-muted-foreground line-clamp-3">
            {post.lead}
          </p>
        )}
      </div>
    </Link>
  );
}
