export interface ReleaseTrackObject {
  title: string;
  subtitle?: string;
  duration?: string;
}

export type ReleaseTrack = string | ReleaseTrackObject;

export interface ReleaseDisc {
  title?: string;
  tracks: ReleaseTrack[];
}

export interface ReleaseCredit {
  key: string;
  value: string;
}

export interface Release {
  slug: string;
  title: string;
  date: string;
  type: "album" | "single" | "compilation" | "collaboration";
  img: string;
  discs?: ReleaseDisc[];
  credits?: ReleaseCredit[];
  content: string;
}
