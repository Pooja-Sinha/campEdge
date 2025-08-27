import { useState, useEffect, useCallback } from 'react'
import { organizerIntegrationService } from '../services/organizerIntegration'
import type {
  OrganizerCamp,
  AvailabilitySlot,
  CampReview,
  BookingRequest
} from '../services/organizerIntegration'

// Hook for camp management
export const useOrganizerCamps = (organizerId?: string) => {
  const [camps, setCamps] = useState<OrganizerCamp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCamps = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizerIntegrationService.getCamps(organizerId)
      setCamps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch camps')
    } finally {
      setLoading(false)
    }
  }, [organizerId])

  const createCamp = useCallback(async (campData: Partial<OrganizerCamp>) => {
    try {
      const newCamp = await organizerIntegrationService.createCamp(campData)
      setCamps(prev => [...prev, newCamp])
      return newCamp
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create camp')
      throw err
    }
  }, [])

  const updateCamp = useCallback(async (campId: string, campData: Partial<OrganizerCamp>) => {
    try {
      const updatedCamp = await organizerIntegrationService.updateCamp(campId, campData)
      setCamps(prev => prev.map(camp => camp.id === campId ? updatedCamp : camp))
      return updatedCamp
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update camp')
      throw err
    }
  }, [])

  const deleteCamp = useCallback(async (campId: string) => {
    try {
      await organizerIntegrationService.deleteCamp(campId)
      setCamps(prev => prev.filter(camp => camp.id !== campId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete camp')
      throw err
    }
  }, [])

  const publishCamp = useCallback(async (campId: string) => {
    try {
      await organizerIntegrationService.publishCampToPublic(campId)
      setCamps(prev => prev.map(camp => 
        camp.id === campId ? { ...camp, status: 'active' as const } : camp
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish camp')
      throw err
    }
  }, [])

  const unpublishCamp = useCallback(async (campId: string) => {
    try {
      await organizerIntegrationService.unpublishCampFromPublic(campId)
      setCamps(prev => prev.map(camp => 
        camp.id === campId ? { ...camp, status: 'inactive' as const } : camp
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish camp')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchCamps()
  }, [fetchCamps])

  return {
    camps,
    loading,
    error,
    refetch: fetchCamps,
    createCamp,
    updateCamp,
    deleteCamp,
    publishCamp,
    unpublishCamp
  }
}

// Hook for availability management
export const useAvailability = (campId: string) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAvailability = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizerIntegrationService.getAvailability(campId, startDate, endDate)
      setAvailability(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch availability')
    } finally {
      setLoading(false)
    }
  }, [campId])

  const updateAvailability = useCallback(async (newAvailability: AvailabilitySlot[]) => {
    try {
      await organizerIntegrationService.updateAvailability(campId, newAvailability)
      setAvailability(newAvailability)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availability')
      throw err
    }
  }, [campId])

  useEffect(() => {
    if (campId) {
      fetchAvailability()
    }
  }, [campId, fetchAvailability])

  return {
    availability,
    loading,
    error,
    refetch: fetchAvailability,
    updateAvailability
  }
}

// Hook for booking management
export const useOrganizerBookings = (organizerId?: string) => {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async (status?: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizerIntegrationService.getBookings(organizerId, status)
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [organizerId])

  const updateBookingStatus = useCallback(async (bookingId: string, status: string, notes?: string) => {
    try {
      const updatedBooking = await organizerIntegrationService.updateBookingStatus(bookingId, status, notes)
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? updatedBooking : booking
      ))
      return updatedBooking
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking status')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus
  }
}

// Hook for review management
export const useOrganizerReviews = (campId?: string, organizerId?: string) => {
  const [reviews, setReviews] = useState<CampReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizerIntegrationService.getReviews(campId, organizerId)
      setReviews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }, [campId, organizerId])

  const respondToReview = useCallback(async (reviewId: string, response: string) => {
    try {
      await organizerIntegrationService.respondToReview(reviewId, response)
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              response: { 
                content: response, 
                createdAt: new Date().toISOString() 
              } 
            } 
          : review
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to review')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    respondToReview
  }
}

// Hook for analytics
export const useOrganizerAnalytics = (organizerId: string) => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (timeRange: string = '30d') => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizerIntegrationService.getAnalytics(organizerId, timeRange)
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [organizerId])

  useEffect(() => {
    if (organizerId) {
      fetchAnalytics()
    }
  }, [organizerId, fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}

// Hook for media management
export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadMedia = useCallback(async (file: File, campId?: string) => {
    try {
      setUploading(true)
      setError(null)
      const result = await organizerIntegrationService.uploadMedia(file, campId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  const deleteMedia = useCallback(async (mediaId: string) => {
    try {
      await organizerIntegrationService.deleteMedia(mediaId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media')
      throw err
    }
  }, [])

  return {
    uploading,
    error,
    uploadMedia,
    deleteMedia
  }
}

// Hook for system sync
export const useSystemSync = () => {
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  const syncWithMainSystem = useCallback(async () => {
    try {
      setSyncing(true)
      setError(null)
      await organizerIntegrationService.syncWithMainSystem()
      setLastSyncTime(new Date().toISOString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with main system')
      throw err
    } finally {
      setSyncing(false)
    }
  }, [])

  return {
    syncing,
    error,
    lastSyncTime,
    syncWithMainSystem
  }
}
