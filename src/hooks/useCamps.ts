import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campApi, wishlistApi, bookingApi, reviewApi } from '../services/api';
import type { SearchFilters } from '../types/index';

// Query keys
export const CAMP_QUERY_KEYS = {
  all: ['camps'] as const,
  lists: () => [...CAMP_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: SearchFilters, page?: number, limit?: number) => 
    [...CAMP_QUERY_KEYS.lists(), { filters, page, limit }] as const,
  details: () => [...CAMP_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CAMP_QUERY_KEYS.details(), id] as const,
  featured: () => [...CAMP_QUERY_KEYS.all, 'featured'] as const,
  search: (query: string) => [...CAMP_QUERY_KEYS.all, 'search', query] as const,
};

// Hook to get camps with filters and pagination
export const useCamps = (
  filters?: SearchFilters,
  page = 1,
  limit = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: CAMP_QUERY_KEYS.list(filters, page, limit),
    queryFn: async () => campApi.getCamps(filters, page, limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a single camp by ID
export const useCamp = (id: string, enabled = true) => {
  return useQuery({
    queryKey: CAMP_QUERY_KEYS.detail(id),
    queryFn: async () => campApi.getCampById(id),
    enabled: enabled && Boolean(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook to get featured camps
export const useFeaturedCamps = (enabled = true) => {
  return useQuery({
    queryKey: CAMP_QUERY_KEYS.featured(),
    queryFn: async () => campApi.getFeaturedCamps(),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook to search camps
export const useSearchCamps = (query: string, enabled = true) => {
  return useQuery({
    queryKey: CAMP_QUERY_KEYS.search(query),
    queryFn: async () => campApi.searchCamps(query),
    enabled: enabled && query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to add/remove camps from wishlist
export const useWishlist = () => {
  const queryClient = useQueryClient();

  const addToWishlist = useMutation({
    mutationFn: async ({ userId, campId, notes }: { userId: string; campId: string; notes?: string }) =>
      wishlistApi.addToWishlist(userId, campId, notes),
    onSuccess: () => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async ({ userId, campId }: { userId: string; campId: string }) =>
      wishlistApi.removeFromWishlist(userId, campId),
    onSuccess: () => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return {
    addToWishlist,
    removeFromWishlist,
  };
};

// Hook to get user's wishlist
export const useUserWishlist = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => wishlistApi.getUserWishlist(userId),
    enabled: enabled && Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to check if a camp is in user's wishlist
export const useIsInWishlist = (userId: string | null | undefined, campId: string) => {
  const shouldFetch = Boolean(userId) && Boolean(campId);
  const { data: wishlistResponse } = useUserWishlist(userId || '', shouldFetch);

  const isInWishlist = shouldFetch && wishlistResponse?.success
    ? wishlistResponse.data?.some(item => item.campId === campId)
    : false;

  return isInWishlist;
};

// Hook for camp filters with local state management
export const useCampFilters = () => {
  const queryClient = useQueryClient();

  const clearFilters = () => {
    // Invalidate all camp list queries to refetch with no filters
    queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEYS.lists() });
  };

  const applyFilters = (_filters: SearchFilters) => {
    // Invalidate current queries and fetch with new filters
    queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEYS.lists() });
  };

  return {
    clearFilters,
    applyFilters,
  };
};

// Hook to get camp statistics (for admin/analytics)
export const useCampStats = () => {
  return useQuery({
    queryKey: ['camp-stats'],
    queryFn: async () => {
      const { camps } = await campApi.getCamps(undefined, 1, 1000); // Get all camps
      
      const stats = {
        totalCamps: camps.length,
        featuredCamps: camps.filter(camp => camp.featured).length,
        verifiedCamps: camps.filter(camp => camp.verified).length,
        averageRating: camps.reduce((sum, camp) => sum + camp.rating.average, 0) / camps.length,
        totalReviews: camps.reduce((sum, camp) => sum + camp.rating.count, 0),
        difficultyDistribution: {
          easy: camps.filter(camp => camp.difficulty === 'easy').length,
          moderate: camps.filter(camp => camp.difficulty === 'moderate').length,
          challenging: camps.filter(camp => camp.difficulty === 'challenging').length,
          extreme: camps.filter(camp => camp.difficulty === 'extreme').length,
        },
        stateDistribution: camps.reduce<Record<string, number>>((acc, camp) => {
          const {state} = camp.location;
          acc[state] = (acc[state] || 0) + 1;
          return acc;
        }, {}),
        priceRange: {
          min: Math.min(...camps.map(camp => camp.pricing.basePrice)),
          max: Math.max(...camps.map(camp => camp.pricing.basePrice)),
          average: camps.reduce((sum, camp) => sum + camp.pricing.basePrice, 0) / camps.length,
        },
      };
      
      return stats;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook for infinite scroll camps loading
export const useInfiniteCamps = (filters?: SearchFilters, limit = 10) => {
  return useQuery({
    queryKey: ['camps-infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await campApi.getCamps(filters, pageParam as number, limit);
      return {
        ...result,
        nextPage: result.camps.length === limit ? (pageParam as number) + 1 : undefined,
      };
    },
    // Removed infinite query params for compatibility
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to prefetch camp details (for performance optimization)
export const usePrefetchCamp = () => {
  const queryClient = useQueryClient();

  const prefetchCamp = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: CAMP_QUERY_KEYS.detail(id),
      queryFn: async () => campApi.getCampById(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  return { prefetchCamp };
};

// Hook for camp recommendations (based on user preferences)
export const useCampRecommendations = (
  userId: string, 
  limit = 5, 
  enabled = true
) => {
  return useQuery({
    queryKey: ['camp-recommendations', userId, limit],
    queryFn: async () => {
      // Get user's wishlist and bookings to understand preferences
      const [wishlistResponse, { camps }] = await Promise.all([
        wishlistApi.getUserWishlist(userId),
        campApi.getCamps(undefined, 1, 100) // Get more camps for better recommendations
      ]);

      if (!wishlistResponse.success) {
        return { success: true, data: camps.slice(0, limit) };
      }

      const wishlistedCampIds = wishlistResponse.data?.map(item => item.campId) || [];
      
      // Simple recommendation algorithm:
      // 1. Exclude camps already in wishlist
      // 2. Prioritize featured and highly rated camps
      // 3. Consider similar difficulty levels and locations
      
      const availableCamps = camps.filter(camp => !wishlistedCampIds.includes(camp.id));
      
      const recommendations = availableCamps
        .sort((a, b) => {
          // Prioritize featured camps
          if (a.featured && !b.featured) {return -1;}
          if (!a.featured && b.featured) {return 1;}
          
          // Then by rating
          return b.rating.average - a.rating.average;
        })
        .slice(0, limit);

      return { success: true, data: recommendations };
    },
    enabled: enabled && Boolean(userId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook to get user bookings
export const useUserBookings = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['bookings', 'user', userId],
    queryFn: async () => bookingApi.getUserBookings(userId),
    enabled: enabled && Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get camp reviews
export const useCampReviews = (campId: string, page = 1, limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['reviews', 'camp', campId, page, limit],
    queryFn: async () => reviewApi.getCampReviews(campId, page, limit),
    enabled: enabled && Boolean(campId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to add a review
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.addReview,
    onSuccess: (_, variables) => {
      // Invalidate camp reviews query
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'camp', variables.campId]
      });
      // Invalidate camp details to update rating
      queryClient.invalidateQueries({
        queryKey: CAMP_QUERY_KEYS.detail(variables.campId)
      });
    },
  });
};
