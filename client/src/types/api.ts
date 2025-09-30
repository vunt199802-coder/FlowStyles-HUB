// Shared API types for consistent data structures across the application

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'client' | 'stylist' | 'barber' | 'nail_tech' | 'massage_therapist';
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  businessName?: string | null;
  createdAt?: string;
}

export interface Provider {
  id: string;
  businessName: string;
  businessType: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  services?: Service[];
  portfolio?: PortfolioImage[];
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  duration: number;
}

export interface PortfolioImage {
  id: string;
  afterImage: string;
  beforeImage: string | null;
  title: string | null;
  description?: string | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  budgetMin: string | null;
  budgetMax: string | null;
  urgency: string | null;
  status: string;
  createdAt: string;
  poster?: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    fullName: string;
    username: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  bookingId: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    username: string;
  };
}

export enum MessageType {
  TEXT = 'text',
  BOOKING_REQUEST = 'booking_request',
  BOOKING_CONFIRMATION = 'booking_confirmation',
  APPOINTMENT_REMINDER = 'appointment_reminder',
}

export interface Booking {
  id: string;
  serviceId: string;
  appointmentDate: string;
  duration: number;
  status: string;
  totalPrice: string;
  notes: string | null;
  service?: {
    name: string;
    description: string | null;
  };
  provider?: {
    fullName: string;
    businessName: string | null;
    city: string | null;
  };
}
