import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const ctaVariants = cva(
  "w-screen -ml-[50vw] left-1/2 relative py-16 md:py-20",
  {
    variants: {
      variant: {
        brand: "bg-brand text-primary-foreground",
        dark: "bg-card text-card-foreground",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
);

const buttonVariants = cva(
  "inline-flex items-center gap-2 px-6 py-3 font-display text-sm tracking-wider uppercase transition-opacity hover:opacity-90",
  {
    variants: {
      variant: {
        brand: "bg-primary-foreground text-brand",
        dark: "bg-brand text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
);

interface CallToActionProps extends VariantProps<typeof ctaVariants> {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
}

export function CallToAction({
  title,
  description,
  buttonLabel,
  buttonHref,
  variant = "brand",
}: CallToActionProps): React.ReactElement {
  const isExternal = buttonHref.startsWith("http");

  return (
    <section className={ctaVariants({ variant })}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl tracking-wide uppercase mb-4 text-inherit">
          {title}
        </h2>
        {description && (
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            {description}
          </p>
        )}
        {isExternal ? (
          <a
            href={buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant })}
          >
            {buttonLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <Link href={buttonHref} className={buttonVariants({ variant })}>
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
