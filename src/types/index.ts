// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'organizer' | 'owner' | 'admin';

export interface UserPreferences {
  language: 'en' | 'hi';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  currency: 'INR' | 'USD';
}

// Location Types
export interface Location {
  id: string;
  name: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  nearestCity: string;
  altitude?: number;
}

export interface TransportInfo {
  nearestAirport: {
    name: string;
    distance: number;
    code: string;
  };
  nearestRailway: {
    name: string;
    distance: number;
    code: string;
  };
  nearestBusStop: {
    name: string;
    distance: number;
  };
  roadAccess: 'excellent' | 'good' | 'moderate' | 'difficult';
}

// Camp Types
export interface Camp {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  location: Location;
  organizer: Organizer;
  images: CampImage[];
  amenities: Amenity[];
  activities: Activity[];
  itinerary: ItineraryDay[];
  pricing: CampPricing;
  availability: CampAvailability;
  difficulty: DifficultyLevel;
  groupSize: {
    min: number;
    max: number;
  };
  duration: {
    days: number;
    nights: number;
  };
  bestTimeToVisit: Season[];
  weatherInfo: WeatherInfo;
  transportInfo: TransportInfo;
  emergencyContacts: EmergencyContact[];
  packingList: PackingItem[];
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  category: 'landscape' | 'accommodation' | 'activity' | 'food' | 'group';
}

export interface Organizer {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  experience: number; // years
  specialties: string[];
  rating: {
    average: number;
    count: number;
  };
  verified: boolean;
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'accommodation' | 'food' | 'safety' | 'comfort' | 'entertainment';
  description?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration?: string;
  difficulty: DifficultyLevel;
  included: boolean;
  additionalCost?: number;
  category: 'adventure' | 'nature' | 'cultural' | 'wellness' | 'photography';
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[];
  accommodation?: string;
  highlights: string[];
}

export interface CampPricing {
  basePrice: number;
  currency: 'INR' | 'USD';
  groupDiscounts: GroupDiscount[];
  earlyBirdDiscount?: {
    percentage: number;
    validUntil: string;
  };
  includes: string[];
  excludes: string[];
  cancellationPolicy: string;
}

export interface GroupDiscount {
  minSize: number;
  maxSize?: number;
  discountPercentage: number;
}

export interface CampAvailability {
  slots: AvailabilitySlot[];
  blackoutDates: string[];
  advanceBookingDays: number;
  maxBookingsPerSlot: number;
}

export interface AvailabilitySlot {
  id: string;
  startDate: string;
  endDate: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
  status: 'available' | 'limited' | 'full' | 'cancelled';
}

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme';
export type Season = 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter';

export interface WeatherInfo {
  season: Season;
  temperature: {
    min: number;
    max: number;
    unit: 'celsius' | 'fahrenheit';
  };
  rainfall: string;
  humidity: string;
  conditions: string[];
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  available24x7: boolean;
}

export interface PackingItem {
  item: string;
  category: 'clothing' | 'gear' | 'personal' | 'documents' | 'medical';
  essential: boolean;
  provided: boolean;
  notes?: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  campId: string;
  slotId: string;
  participants: Participant[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: string;
  updatedAt: string;
  checkIn?: string;
  checkOut?: string;
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  medicalConditions?: string;
  dietaryRestrictions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';

// Review Types
export interface Review {
  id: string;
  userId: string;
  campId: string;
  bookingId: string;
  rating: number;
  title: string;
  content: string;
  images?: ReviewImage[];
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  response?: OrganizerResponse;
}

export interface ReviewImage {
  id: string;
  url: string;
  caption?: string;
}

export interface OrganizerResponse {
  content: string;
  createdAt: string;
  organizerId: string;
}

// Search and Filter Types
export interface SearchFilters {
  location?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  groupSize?: number;
  difficulty?: DifficultyLevel[];
  activities?: string[];
  amenities?: string[];
  season?: Season[];
  duration?: {
    min: number;
    max: number;
  };
  rating?: number;
  verified?: boolean;
}

export interface SearchResult {
  camps: Camp[];
  total: number;
  page: number;
  limit: number;
  filters: SearchFilters;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  userId: string;
  campId: string;
  addedAt: string;
  notes?: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: BlogCategory;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
}

export type BlogCategory = 'guide' | 'story' | 'tips' | 'gear' | 'destination' | 'safety';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  campId?: string;
}

export interface BookingForm {
  campId: string;
  slotId: string;
  participants: Omit<Participant, 'id'>[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  specialRequests?: string;
  agreeToTerms: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'booking_confirmed' 
  | 'booking_cancelled' 
  | 'payment_received' 
  | 'camp_reminder' 
  | 'review_request' 
  | 'weather_alert' 
  | 'promotional';
