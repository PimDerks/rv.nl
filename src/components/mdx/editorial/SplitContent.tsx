import Image from "next/image";

interface SplitContentProps {
  image: string;
  imageAlt: string;
  /** Flip image to the right side */
  reverse?: boolean;
  children: React.ReactNode;
}

export function SplitContent({
  image,
  imageAlt,
  reverse = false,
  children,
}: SplitContentProps): React.ReactElement {
  return (
    <section className="w-screen -ml-[50vw] left-1/2 relative bg-surface">
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? "lg:direction-rtl" : ""}`}>
        {/* Image — always first in DOM for mobile */}
        <div className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] ${reverse ? "lg:order-2" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 ${reverse ? "lg:order-1" : ""}`}>
          <div className="prose-content max-w-lg">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
