export interface SongCredit {
  key: string;
  value: string;
}

export interface Song {
  slug: string;
  title: string;
  year?: number;
  writer?: string;
  composer?: string;
  credits?: SongCredit[];
  order?: boolean | number;
  content: string;
}
