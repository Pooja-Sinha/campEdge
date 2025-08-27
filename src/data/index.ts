// Centralized data imports for the organizer dashboard
import organizerData from './organizerData.json'
import campsData from './campsData.json'
import bookingsData from './bookingsData.json'
import reviewsData from './reviewsData.json'
import userReviewsData from './userReviewsData.json'
import availabilityData from './availabilityData.json'
import analyticsData from './analyticsData.json'
import automationData from './automationData.json'
import customersData from './customersData.json'

// Type definitions for better TypeScript support
export interface Organizer {
  id: string
  email: string
  role: string
  profile: {
    personal: {
      firstName: string
      lastName: string
      email: string
      phone: string
      bio: string
      avatar?: string
    }
    business: {
      companyName: string
      businessType: string
      registrationNumber: string
      taxId: string
      website: string
      establishedYear: number
      description: string
      address: string
      city: string
      state: string
      country: string
    }
    social: {
      facebook: string
      instagram: string
      twitter: string
      youtube: string
    }
    verification: {
      emailVerified: boolean
      phoneVerified: boolean
      businessVerified: boolean
      documentsUploaded: boolean
      verificationDate: string
    }
    settings: {
      notifications: {
        email: boolean
        sms: boolean
        push: boolean
      }
      business: {
        autoApproveBookings: boolean
        instantBooking: boolean
        requireDeposit: boolean
        depositPercentage: number
      }
    }
  }
}

export interface Camp {
  id: string
  organizerId: string
  title: string
  shortDescription: string
  description: string
  category: string
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert'
  location: {
    address: string
    city: string
    state: string
    coordinates: { lat: number; lng: number }
  }
  maxParticipants: number
  minParticipants: number
  duration: { days: number; nights: number }
  pricing: {
    basePrice: number
    currency: string
    priceIncludes: string[]
    priceExcludes: string[]
  }
  amenities: string[]
  activities: string[]
  images: string[]
  status: 'active' | 'inactive' | 'draft'
  rating: number
  reviewCount: number
  createdAt: string
}

export interface Booking {
  id: string
  campId: string
  campName: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  participants: number
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  paidAmount: number
  paymentStatus: 'pending' | 'partial' | 'completed' | 'failed'
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  specialRequests?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  campId: string
  campName: string
  customerId: string
  customerName: string
  customerAvatar: string
  rating: number
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
  response?: {
    content: string
    createdAt: string
  }
}

export interface AvailabilitySlot {
  id: string
  date: string
  campId: string
  campName: string
  isAvailable: boolean
  capacity: number
  bookedSlots: number
  basePrice: number
  dynamicPrice?: number
  priceMultiplier: number
  notes?: string
  restrictions?: string[]
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  joinDate: string
  totalBookings: number
  totalSpent: number
  averageRating: number
  lastBooking: string
  preferences: string[]
  segment: string
  status: 'active' | 'inactive' | 'new'
  communicationPreference: 'email' | 'sms' | 'both'
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

// Helper function to get organizer data by email
export const getOrganizerByEmail = (email: string): Organizer | null => {
  if (email === 'organizer@campedge.com') {
    return organizerData.organizer as Organizer
  }
  return null
}

// Helper function to get camps for organizer
export const getCampsForOrganizer = (organizerId: string): Camp[] => {
  return campsData.camps.filter(camp => camp.organizerId === organizerId) as Camp[]
}

// Helper function to get bookings for organizer
export const getBookingsForOrganizer = (organizerId: string): Booking[] => {
  const organizerCampIds = getCampsForOrganizer(organizerId).map(camp => camp.id)
  return bookingsData.bookings.filter(booking =>
    organizerCampIds.includes(booking.campId)
  ) as Booking[]
}

// Helper function to get reviews for organizer
export const getReviewsForOrganizer = (organizerId: string): Review[] => {
  const organizerCampIds = getCampsForOrganizer(organizerId).map(camp => camp.id)
  const mainReviews = reviewsData.reviews.filter(review =>
    organizerCampIds.includes(review.campId)
  ) as Review[]

  const userReviews = userReviewsData.userReviews.filter(review =>
    organizerCampIds.includes(review.campId)
  ) as Review[]

  return [...mainReviews, ...userReviews]
}

// Helper function to get availability for organizer
export const getAvailabilityForOrganizer = (organizerId: string): AvailabilitySlot[] => {
  const organizerCampIds = getCampsForOrganizer(organizerId).map(camp => camp.id)
  return availabilityData.availability.filter(slot => 
    organizerCampIds.includes(slot.campId)
  ) as AvailabilitySlot[]
}

// Helper function to get customers for organizer
export const getCustomersForOrganizer = (organizerId: string): Customer[] => {
  const organizerBookings = getBookingsForOrganizer(organizerId)
  const customerIds = [...new Set(organizerBookings.map(booking => booking.customerId))]
  
  return customersData.customers.filter(customer => 
    customerIds.includes(customer.id)
  ) as Customer[]
}

// Helper function to get dashboard stats for organizer
export const getDashboardStats = (organizerId: string) => {
  const bookings = getBookingsForOrganizer(organizerId)
  const reviews = getReviewsForOrganizer(organizerId)
  const customers = getCustomersForOrganizer(organizerId)
  
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
  const thisMonthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt)
    const now = new Date()
    return bookingDate.getMonth() === now.getMonth() && 
           bookingDate.getFullYear() === now.getFullYear()
  })
  
  const thisMonthRevenue = thisMonthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0
  
  return {
    totalRevenue,
    thisMonthRevenue,
    totalBookings: bookings.length,
    thisMonthBookings: thisMonthBookings.length,
    totalCustomers: customers.length,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    pendingBookings: bookings.filter(b => b.bookingStatus === 'pending').length,
    confirmedBookings: bookings.filter(b => b.bookingStatus === 'confirmed').length,
    completedBookings: bookings.filter(b => b.bookingStatus === 'completed').length
  }
}

// Export all data
export {
  organizerData,
  reviewsData,
  userReviewsData,
  availabilityData,
  analyticsData,
  automationData,
  customersData
}

// Export specific data arrays for easy access
export const { organizer } = organizerData
export const { camps } = campsData
export const { bookings } = bookingsData

export const {
  reviews,
  reviewStats
} = reviewsData

export const {
  userReviews
} = userReviewsData

export const {
  availability,
  pricingRules,
  seasonalTrends
} = availabilityData

export const {
  businessMetrics,
  revenueByMonth,
  campPerformance,
  customerSegments,
  aiInsights,
  predictiveMetrics,
  competitorAnalysis,
  operationalMetrics
} = analyticsData

export const {
  automationRules,
  automationTemplates,
  workflowStats,
  emailTemplates
} = automationData

export const {
  customers,
  customerStats,
  communicationHistory
} = customersData

// Mock API functions for development
export const mockAPI = {
  // Simulate API delay
  delay: async (ms = 500) => {
    await new Promise<void>(resolve => setTimeout(resolve, ms))
  },

  // Get organizer profile
  getOrganizerProfile: async (email: string) => {
    await mockAPI.delay()
    return getOrganizerByEmail(email)
  },

  // Get dashboard data
  getDashboardData: async (organizerId: string) => {
    await mockAPI.delay()
    return {
      stats: getDashboardStats(organizerId),
      recentBookings: getBookingsForOrganizer(organizerId).slice(0, 5),
      recentReviews: getReviewsForOrganizer(organizerId).slice(0, 3),
      upcomingTrips: getBookingsForOrganizer(organizerId)
        .filter(b => new Date(b.checkInDate) > new Date())
        .slice(0, 5)
    }
  },

  // Get analytics data
  getAnalyticsData: async (_organizerId: string) => {
    await mockAPI.delay()
    return analyticsData
  },

  // Get automation data
  getAutomationData: async (_organizerId: string) => {
    await mockAPI.delay()
    return automationData
  }
}
