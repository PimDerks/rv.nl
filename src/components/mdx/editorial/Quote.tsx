interface QuoteProps {
  attribution?: string;
  children: React.ReactNode;
}

export function Quote({ attribution, children }: QuoteProps): React.ReactElement {
  return (
    <blockquote className="relative w-screen -ml-[50vw] left-1/2 py-16 md:py-20 bg-surface">
      <div className="container mx-auto px-4 text-center">
        {/* Decorative quote mark */}
        <span
          className="block font-display text-6xl md:text-8xl text-brand leading-none mb-4 select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <div className="font-body text-2xl md:text-3xl lg:text-4xl italic text-foreground leading-relaxed max-w-4xl mx-auto">
          {children}
        </div>

        {attribution && (
          <footer className="mt-6 font-ui text-sm text-muted-foreground">
            &mdash; {attribution}
          </footer>
        )}
      </div>
    </blockquote>
  );
}
