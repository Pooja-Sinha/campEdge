// Integration service for organizer camps with main booking system

export interface OrganizerCamp {
  id: string
  organizerId: string
  organizerName: string
  organizerRating: number
  organizerVerified: boolean
  title: string
  description: string
  shortDescription: string
  category: string
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert'
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number }
    nearbyLandmarks: string[]
  }
  maxParticipants: number
  minParticipants: number
  duration: {
    days: number
    nights: number
  }
  pricing: {
    basePrice: number
    currency: string
    priceIncludes: string[]
    priceExcludes: string[]
  }
  amenities: string[]
  activities: string[]
  services: string[]
  equipment: string[]
  images: string[]
  videos: string[]
  policies: {
    cancellation: string
    refund: string
    ageRestriction: string
    healthRequirements: string
  }
  emergencyContact: {
    name: string
    phone: string
    email: string
  }
  safetyMeasures: string[]
  status: 'draft' | 'active' | 'inactive'
  availability: AvailabilitySlot[]
  reviews: CampReview[]
  createdAt: string
  updatedAt: string
}

export interface AvailabilitySlot {
  id: string
  date: string
  isAvailable: boolean
  capacity: number
  bookedSlots: number
  basePrice: number
  dynamicPrice?: number
  priceMultiplier: number
  notes?: string
  restrictions?: string[]
}

export interface CampReview {
  id: string
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
  createdAt: string
  response?: {
    content: string
    createdAt: string
  }
}

export interface BookingRequest {
  id: string
  campId: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  participants: number
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  paymentStatus: 'pending' | 'partial' | 'completed' | 'failed'
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  specialRequests?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
}

class OrganizerIntegrationService {
  private baseUrl = '/api/organizer'

  // Camp Management
  async createCamp(campData: Partial<OrganizerCamp>): Promise<OrganizerCamp> {
    try {
      const response = await fetch(`${this.baseUrl}/camps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(campData)
      })

      if (!response.ok) {
        throw new Error('Failed to create camp')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating camp:', error)
      throw error
    }
  }

  async updateCamp(campId: string, campData: Partial<OrganizerCamp>): Promise<OrganizerCamp> {
    try {
      const response = await fetch(`${this.baseUrl}/camps/${campId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(campData)
      })

      if (!response.ok) {
        throw new Error('Failed to update camp')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating camp:', error)
      throw error
    }
  }

  async deleteCamp(campId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/camps/${campId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete camp')
      }
    } catch (error) {
      console.error('Error deleting camp:', error)
      throw error
    }
  }

  async getCamps(organizerId?: string): Promise<OrganizerCamp[]> {
    try {
      const url = organizerId 
        ? `${this.baseUrl}/camps?organizerId=${organizerId}`
        : `${this.baseUrl}/camps`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch camps')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching camps:', error)
      throw error
    }
  }

  async getCamp(campId: string): Promise<OrganizerCamp> {
    try {
      const response = await fetch(`${this.baseUrl}/camps/${campId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch camp')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching camp:', error)
      throw error
    }
  }

  // Availability Management
  async updateAvailability(campId: string, availability: AvailabilitySlot[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/camps/${campId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ availability })
      })

      if (!response.ok) {
        throw new Error('Failed to update availability')
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      throw error
    }
  }

  async getAvailability(campId: string, startDate?: string, endDate?: string): Promise<AvailabilitySlot[]> {
    try {
      let url = `${this.baseUrl}/camps/${campId}/availability`
      const params = new URLSearchParams()
      
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching availability:', error)
      throw error
    }
  }

  // Booking Management
  async getBookings(organizerId?: string, status?: string): Promise<BookingRequest[]> {
    try {
      const params = new URLSearchParams()
      if (organizerId) params.append('organizerId', organizerId)
      if (status) params.append('status', status)

      const url = `${this.baseUrl}/bookings${params.toString() ? `?${params.toString()}` : ''}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  }

  async updateBookingStatus(bookingId: string, status: string, notes?: string): Promise<BookingRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ status, notes })
      })

      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  // Review Management
  async getReviews(campId?: string, organizerId?: string): Promise<CampReview[]> {
    try {
      const params = new URLSearchParams()
      if (campId) params.append('campId', campId)
      if (organizerId) params.append('organizerId', organizerId)

      const url = `${this.baseUrl}/reviews${params.toString() ? `?${params.toString()}` : ''}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  }

  async respondToReview(reviewId: string, response: string): Promise<void> {
    try {
      const apiResponse = await fetch(`${this.baseUrl}/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ response })
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to respond to review')
      }
    } catch (error) {
      console.error('Error responding to review:', error)
      throw error
    }
  }

  // Analytics
  async getAnalytics(organizerId: string, timeRange: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics?organizerId=${organizerId}&timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  }

  // Media Management
  async uploadMedia(file: File, campId?: string): Promise<{ url: string; id: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (campId) formData.append('campId', campId)

      const response = await fetch(`${this.baseUrl}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload media')
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading media:', error)
      throw error
    }
  }

  async deleteMedia(mediaId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete media')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      throw error
    }
  }

  // Utility Methods
  private getAuthToken(): string {
    // Get auth token from localStorage or context
    return localStorage.getItem('authToken') || ''
  }

  // Public API Integration - Make organizer camps available in main booking system
  async publishCampToPublic(campId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/camps/${campId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to publish camp')
      }
    } catch (error) {
      console.error('Error publishing camp:', error)
      throw error
    }
  }

  async unpublishCampFromPublic(campId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/camps/${campId}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to unpublish camp')
      }
    } catch (error) {
      console.error('Error unpublishing camp:', error)
      throw error
    }
  }

  // Sync organizer camps with main camps data
  async syncWithMainSystem(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to sync with main system')
      }
    } catch (error) {
      console.error('Error syncing with main system:', error)
      throw error
    }
  }
}

// Export singleton instance
export const organizerIntegrationService = new OrganizerIntegrationService()
