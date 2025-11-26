export interface User {
  id: string;
  username: string;
  email: string;
  walletBalance: number;
  bio: string;
  profileStyle: ProfileStyle;
  following: string[]; // IDs of users followed
  subscribedEventIds: string[]; // IDs of events subscribed to
}

export interface ProfileStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage: string;
  borderRadius: string; // For that fluid blob look
  fontFamily: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  status: 'Funding' | 'Completed';
  contributionAmount?: number;
}

export interface Purchase {
  id: string;
  itemName: string;
  price: number;
  date: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  lineup: string[];
}

export interface FeedItem {
  id: string;
  type: 'video' | 'audio' | 'text' | 'image';
  title: string;
  content: string; // URL for media, or text body
  thumbnail?: string;
  date: string;
  series: string; // e.g., "Series 1", "Series 2"
}

export const DEFAULT_STYLE: ProfileStyle = {
  backgroundColor: '#1c1917', // Bark/Warm Black
  textColor: '#e7e5e4', // Sand
  accentColor: '#84cc16', // Moss
  backgroundImage: '',
  borderRadius: '24px',
  fontFamily: 'Bebas Neue',
};