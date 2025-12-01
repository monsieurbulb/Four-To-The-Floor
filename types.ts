
export interface User {
  id: string;
  username: string;
  email: string;
  walletBalance: number;
  points: number; // Loyalty points
  walletAddress?: string;
  bio: string;
  profileStyle: ProfileStyle;
  following: string[];
  subscribedEventIds: string[];
  isAdmin: boolean;
  profileImage?: string;
  contacts?: Contact[];
  assets?: Asset[]; // Inventory (Emojis, etc)
}

export interface Asset {
  id: string;
  type: 'emoji' | 'badge' | 'ticket';
  name: string;
  icon: string; // The emoji char or image URL
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCash?: number;
  pricePoints?: number;
  image: string;
  assets: Asset[]; // What you get when you buy it
}

export interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
}

export interface ProfileStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage: string;
  borderRadius: string;
  fontFamily: string;
}

export interface Purchase {
  id: string;
  itemName: string;
  price: number;
  date: string;
  image: string;
  lineup: string[];
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
  content: string;
  thumbnail?: string;
  date: string;
  series: string;
  livepeerPlaybackId?: string;
}

export const DEFAULT_STYLE: ProfileStyle = {
  backgroundColor: '#1c1917',
  textColor: '#e7e5e4',
  accentColor: '#2dd4bf',
  backgroundImage: '',
  borderRadius: '24px',
  fontFamily: 'Bebas Neue',
};
