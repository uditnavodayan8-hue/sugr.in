export enum Screen {
  Splash = 'Splash',
  Onboarding = 'Onboarding',
  RoleSelection = 'RoleSelection',
  Discovery = 'Discovery',
  ProfileDetail = 'ProfileDetail',
  Board = 'Board',
  ChatList = 'ChatList',
  ChatDetail = 'ChatDetail',
  VideoCall = 'VideoCall',
  Profile = 'Profile',
  Premium = 'Premium',
  BlackCard = 'BlackCard',
  Vault = 'Vault',
  Gifts = 'Gifts',
  MatchReveal = 'MatchReveal',
  Filters = 'Filters'
}

export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  image: string;
  verified: boolean;
  role: 'Muse' | 'Benefactor';
  matchPercentage?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  isGift?: boolean;
  giftType?: string;
  isPrivateMedia?: boolean;
}