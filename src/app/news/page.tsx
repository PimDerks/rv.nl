import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getPaginatedPosts } from "@/lib/posts";
import { NewsCard } from "@/components/content";
import { PageHero } from "@/components/layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates from Robby Valentine.",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const { posts, totalPages, currentPage } = getPaginatedPosts(page, 6);

  return (
    <PageHero title="News" image="/images/headers/alliance9.jpg">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-12">
            {currentPage > 1 ? (
              <Button variant="outline" asChild>
                <Link href={`/news?page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}

            <span className="text-sm text-muted-foreground px-4">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Button variant="outline" asChild>
                <Link href={`/news?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </nav>
        )}
      </div>
    </PageHero>
  );
}
