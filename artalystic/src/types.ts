export type Category = 'Traditional Art' | 'Fan Art' | 'Digital Art' | 'Handmade Art';

export interface Artwork {
  id: string;
  artworkCode?: string;
  title: string;
  artist: string;
  artistName?: string;
  artistEmail?: string;
  category: Category;
  medium: string;
  dimensions?: string;
  year: string | number;
  imageUrl: string;
  description: string;
  story?: string;
  artistNote?: string;
  fileType?: string;
  available?: boolean;
  featured?: boolean;
  views?: number;
  likes?: number;
  dateAdded?: string;
  createdAt?: any;
}

export interface EmailRequest {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkArtist: string;
  artworkImageUrl?: string;
  requesterName: string;
  requesterEmail: string;
  message?: string;
  timestamp: string;
  status: 'Sent' | 'Pending';
}

export interface ArtistApplication {
  id: string;
  artistName: string;
  email: string;
  portfolioUrl: string;
  primaryCategory: Category;
  bio: string;
  artSampleUrl?: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Reviewed';
}
