import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Camp, SearchFilters } from '../types/index'
import { campsData } from '../data/camps_mock_data'

interface CampsState {
  // Data
  camps: Camp[]
  featuredCamps: Camp[]
  searchResults: Camp[]
  selectedCamp: Camp | null
  
  // UI State
  isLoading: boolean
  error: string | null
  searchQuery: string
  filters: SearchFilters
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'duration' | 'newest'
  viewMode: 'grid' | 'list'
  
  // Pagination
  currentPage: number
  itemsPerPage: number
  totalItems: number
  
  // Actions
  loadCamps: () => Promise<void>
  loadFeaturedCamps: () => Promise<void>
  searchCamps: (query: string, filters?: SearchFilters) => Promise<void>
  getCampById: (id: string) => Promise<Camp | null>
  setFilters: (filters: Partial<SearchFilters>) => void
  setSortBy: (sortBy: CampsState['sortBy']) => void
  setViewMode: (viewMode: 'grid' | 'list') => void
  setCurrentPage: (page: number) => void
  clearSearch: () => void
  clearError: () => void
}

// Helper functions
const filterCamps = (camps: Camp[], filters: SearchFilters): Camp[] => {
  return camps.filter(camp => {
    // Location filter
    if (filters.location && !camp.location.name.toLowerCase().includes(filters.location.toLowerCase()) &&
        !camp.location.state.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }
    
    // Price range filter
    if (filters.priceRange) {
      const price = camp.pricing.basePrice
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false
      }
    }
    
    // Difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      if (!filters.difficulty.includes(camp.difficulty)) {
        return false
      }
    }
    
    // Duration filter
    if (filters.duration) {
      const days = camp.duration.days
      if (days < filters.duration.min || days > filters.duration.max) {
        return false
      }
    }
    
    // Season filter
    if (filters.season && filters.season.length > 0) {
      const hasMatchingSeason = filters.season.some(season => 
        camp.bestTimeToVisit.includes(season)
      )
      if (!hasMatchingSeason) {
        return false
      }
    }
    
    // Activities filter
    if (filters.activities && filters.activities.length > 0) {
      const hasMatchingActivity = filters.activities.some(activity =>
        camp.activities.some(campActivity => 
          campActivity.name.toLowerCase().includes(activity.toLowerCase())
        )
      )
      if (!hasMatchingActivity) {
        return false
      }
    }
    
    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasMatchingAmenity = filters.amenities.some(amenity =>
        camp.amenities.some(campAmenity => 
          campAmenity.name.toLowerCase().includes(amenity.toLowerCase())
        )
      )
      if (!hasMatchingAmenity) {
        return false
      }
    }
    
    // Rating filter
    if (filters.rating && camp.rating.average < filters.rating) {
      return false
    }
    
    return true
  })
}

const sortCamps = (camps: Camp[], sortBy: CampsState['sortBy']): Camp[] => {
  const sorted = [...camps]
  
  switch (sortBy) {
    case 'featured':
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    case 'price-low':
      return sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice)
    case 'price-high':
      return sorted.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice)
    case 'rating':
      return sorted.sort((a, b) => b.rating.average - a.rating.average)
    case 'duration':
      return sorted.sort((a, b) => a.duration.days - b.duration.days)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    default:
      return sorted
  }
}

export const useCampsStore = create<CampsState>()(
  persist(
    (set, get) => ({
      // Initial state
      camps: [],
      featuredCamps: [],
      searchResults: [],
      selectedCamp: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      filters: {},
      sortBy: 'featured',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 12,
      totalItems: 0,

      // Actions
      loadCamps: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const camps = campsData.camps
          const filtered = filterCamps(camps, get().filters)
          const sorted = sortCamps(filtered, get().sortBy)
          
          set({ 
            camps: sorted,
            totalItems: sorted.length,
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load camps',
            isLoading: false 
          })
        }
      },

      loadFeaturedCamps: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const featuredCamps = campsData.camps.filter(camp => camp.featured)
          
          set({ 
            featuredCamps,
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load featured camps',
            isLoading: false 
          })
        }
      },

      searchCamps: async (query: string, filters?: SearchFilters) => {
        set({ isLoading: true, error: null, searchQuery: query })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 400))
          
          let results = campsData.camps
          
          // Text search
          if (query.trim()) {
            results = results.filter(camp =>
              camp.title.toLowerCase().includes(query.toLowerCase()) ||
              camp.description.toLowerCase().includes(query.toLowerCase()) ||
              camp.location.name.toLowerCase().includes(query.toLowerCase()) ||
              camp.location.state.toLowerCase().includes(query.toLowerCase()) ||
              camp.activities.some(activity => 
                activity.name.toLowerCase().includes(query.toLowerCase())
              )
            )
          }
          
          // Apply filters
          const currentFilters = filters || get().filters
          results = filterCamps(results, currentFilters)
          
          // Sort results
          results = sortCamps(results, get().sortBy)
          
          set({ 
            searchResults: results,
            totalItems: results.length,
            currentPage: 1,
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Search failed',
            isLoading: false 
          })
        }
      },

      getCampById: async (id: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const camp = campsData.camps.find(c => c.id === id)
          
          if (!camp) {
            throw new Error('Camp not found')
          }
          
          set({ 
            selectedCamp: camp,
            isLoading: false 
          })
          
          return camp
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load camp',
            isLoading: false 
          })
          return null
        }
      },

      setFilters: (newFilters: Partial<SearchFilters>) => {
        const currentFilters = get().filters
        const updatedFilters = { ...currentFilters, ...newFilters }
        
        set({ filters: updatedFilters, currentPage: 1 })
        
        // Re-apply filters to current results
        const { camps, searchResults, searchQuery } = get()
        const dataToFilter = searchQuery ? searchResults : camps
        const filtered = filterCamps(dataToFilter, updatedFilters)
        const sorted = sortCamps(filtered, get().sortBy)
        
        if (searchQuery) {
          set({ searchResults: sorted, totalItems: sorted.length })
        } else {
          set({ camps: sorted, totalItems: sorted.length })
        }
      },

      setSortBy: (sortBy: CampsState['sortBy']) => {
        set({ sortBy, currentPage: 1 })
        
        // Re-sort current results
        const { camps, searchResults, searchQuery } = get()
        const dataToSort = searchQuery ? searchResults : camps
        const sorted = sortCamps(dataToSort, sortBy)
        
        if (searchQuery) {
          set({ searchResults: sorted })
        } else {
          set({ camps: sorted })
        }
      },

      setViewMode: (viewMode: 'grid' | 'list') => {
        set({ viewMode })
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page })
      },

      clearSearch: () => {
        set({ 
          searchQuery: '', 
          searchResults: [],
          currentPage: 1 
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'camps-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        filters: state.filters
      }),
    }
  )
)
