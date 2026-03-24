import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Facebook, Instagram, Youtube } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/content/ContactForm";
import { PageHero } from "@/components/layout";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Robby Valentine for bookings, press inquiries, and more.",
};

export default function ContactPage(): React.ReactElement {
  return (
    <>
    <PageHero
      title="Contact"
      subtitle="For interviews, bookings and fanmail"
      image="/images/headers/alliance7.jpg"
    />
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="max-w-xl">
            <p className="text-muted-foreground mb-8">
              Have a question or want to get in touch? Fill out the form below
              and we will get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <div className="rounded-lg border p-6 bg-card">
              <h2 className="font-heading text-lg font-semibold mb-4">
                Bookings & Press
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                For booking inquiries, press requests, or business matters,
                please reach out via the contact form or email directly.
              </p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-foreground/80 transition-colors"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.contactEmail}
              </a>
            </div>

            <div className="rounded-lg border p-6 bg-card">
              <h2 className="font-heading text-lg font-semibold mb-4">
                Follow Along
              </h2>
              <div className="flex flex-col gap-3">
                <Link
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Link>
                <Link
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Link>
                <Link
                  href={siteConfig.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
