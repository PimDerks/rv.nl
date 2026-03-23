export interface CarouselSlide {
  slug: string;
  title: string;
  subtitle?: string;
  link: string;
  external?: boolean;
  image: string;
  order: number;
}
