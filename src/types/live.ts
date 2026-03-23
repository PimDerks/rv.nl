export interface LiveEvent {
  slug: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  url?: string;
  cancelled?: boolean;
  postponed?: boolean;
  info?: string;
}
