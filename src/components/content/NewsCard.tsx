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
    <Link href={href} className="group block" data-testid="news-card">
      {post.img && (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-4">
          <Image
            src={post.img}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div>
        <time className="text-sm text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <h3 className="font-heading font-semibold text-lg mt-1 group-hover:text-foreground/80 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.lead && (
          <p className="text-muted-foreground mt-2 line-clamp-2">{post.lead}</p>
        )}
      </div>
    </Link>
  );
}
