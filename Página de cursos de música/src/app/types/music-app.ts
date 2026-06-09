export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  albumId?: number;
  duration: string;
  image: string;
  audioUrl?: string;
}

export interface AlbumTracklistItem {
  n: number;
  title: string;
  duration: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  image: string;
  year: string;
  genre: string;
  tracks: number;
  duration: string;
  color: string;
  description: string;
  tracklist: AlbumTracklistItem[];
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  instructorImg: string;
  image: string;
  level: string;
  levelColor: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  tags: string[];
  description: string;
  featured: boolean;
}

export interface UserData {
  name: string;
  email: string;
  phone?: string;
}
