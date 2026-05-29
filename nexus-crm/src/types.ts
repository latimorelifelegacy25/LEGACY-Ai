export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  notes?: string;
  status: 'lead' | 'prospect' | 'customer' | 'lost';
  ownerUid: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  contactId?: string;
  ownerUid: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'task' | 'meeting';
  subject: string;
  description?: string;
  contactId?: string;
  ownerUid: string;
  timestamp: string;
}

export interface SocialAccount {
  id: string;
  platform: 'twitter' | 'linkedin' | 'facebook';
  name: string;
  profileImage?: string;
  ownerUid: string;
  connectedAt: string;
}

export interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'posted';
  ownerUid: string;
  createdAt: string;
}

export interface AIContent {
  id: string;
  prompt: string;
  result: string;
  type: string;
  category?: string;
  ownerUid: string;
  createdAt: string;
}
