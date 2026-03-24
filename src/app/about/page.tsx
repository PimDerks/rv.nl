import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRight } from "lucide-react";

import { getAboutPage } from "@/lib/about";
import { getAllBandMembers } from "@/lib/band";
import { generatePersonJsonLd } from "@/lib/jsonld";
import { mdxComponents } from "@/components/mdx";
import { BandMemberCard } from "@/components/content/BandMemberCard";
import { PageHero } from "@/components/layout";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Robby Valentine - biography, influences, and band members.",
};

export default function AboutPage(): React.ReactElement {
  const about = getAboutPage();
  const bandMembers = getAllBandMembers();

  if (!about) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generatePersonJsonLd() }}
      />
      <PageHero
        title={about.title}
        subtitle={about.subtitle}
        image="/images/headers/alliance3.jpg"
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">

          <div className="prose-content">
            <MDXRemote source={about.content} components={mdxComponents} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {about.profile && (
              <div className="rounded-lg border p-6 bg-card">
                <h2 className="font-heading text-lg font-semibold mb-4">
                  Profile
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{about.profile.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Born</dt>
                    <dd className="font-medium">{about.profile.dateOfBirth}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Influences</dt>
                    <dd className="font-medium">{about.profile.influences}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Instruments</dt>
                    <dd className="font-medium">{about.profile.instruments}</dd>
                  </div>
                </dl>
              </div>
            )}

            {bandMembers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-semibold">
                    The Band
                  </h2>
                  <Link
                    href="/about/band"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {bandMembers.slice(0, 4).map((member) => (
                    <div key={member.slug}>
                      {member.img && (
                        <Link href={`/about/band/${member.slug}`}>
                          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={member.img}
                              alt={member.title}
                              fill
                              className="object-cover"
                              sizes="150px"
                            />
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
