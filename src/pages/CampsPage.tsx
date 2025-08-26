import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Calendar,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  Heart,
  Eye
} from 'lucide-react'
import { useCamps, useWishlist, useUserWishlist } from '../hooks/useCamps'
import { useIsAuthenticated } from '../hooks/useAuth'
import type { SearchFilters, DifficultyLevel, Season } from '../types/index'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatDuration, formatGroupSize } from '../utils/format'
import { cn } from '../utils/cn'

const CampsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const { isAuthenticated, user } = useIsAuthenticated()
  const { addToWishlist, removeFromWishlist } = useWishlist()

  // Fetch user's wishlist once at component level
  const { data: wishlistResponse } = useUserWishlist(user?.id || '', !!user?.id)
  const userWishlist = wishlistResponse?.success ? wishlistResponse.data : []

  // Helper function to check if a camp is in wishlist
  const isInWishlist = (campId: string) => {
    return userWishlist.some(item => item.campId === campId)
  }

  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    dateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
      startDate: searchParams.get('startDate')!,
      endDate: searchParams.get('endDate')!
    } : undefined,
    priceRange: {
      min: parseInt(searchParams.get('minPrice') || '0'),
      max: parseInt(searchParams.get('maxPrice') || '50000')
    },
    difficulty: (searchParams.get('difficulty')?.split(',') as DifficultyLevel[]) || [],
    groupSize: parseInt(searchParams.get('groupSize') || '0') || undefined,
    duration: {
      min: parseInt(searchParams.get('minDuration') || '1'),
      max: parseInt(searchParams.get('maxDuration') || '30')
    },
    season: (searchParams.get('season')?.split(',') as Season[]) || [],
    activities: searchParams.get('activities')?.split(',') || [],
    amenities: searchParams.get('amenities')?.split(',') || [],
    rating: parseInt(searchParams.get('rating') || '0') || undefined,
    verified: searchParams.get('verified') === 'true' || undefined
  })

  const { data: campsResponse, isLoading, error } = useCamps(filters, currentPage, 12)

  // Sync searchQuery with filters.search when filters change from URL
  useEffect(() => {
    if (filters.search !== searchQuery) {
      setSearchQuery(filters.search || '')
    }
  }, [filters.search])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (filters.search) params.set('search', filters.search)
    if (filters.location) params.set('location', filters.location)
    if (filters.dateRange?.startDate) params.set('startDate', filters.dateRange.startDate)
    if (filters.dateRange?.endDate) params.set('endDate', filters.dateRange.endDate)
    if (filters.priceRange?.min) params.set('minPrice', filters.priceRange.min.toString())
    if (filters.priceRange?.max && filters.priceRange.max < 50000) {
      params.set('maxPrice', filters.priceRange.max.toString())
    }
    if (filters.difficulty?.length) params.set('difficulty', filters.difficulty.join(','))
    if (filters.groupSize) params.set('groupSize', filters.groupSize.toString())
    if (filters.duration?.min && filters.duration.min > 1) {
      params.set('minDuration', filters.duration.min.toString())
    }
    if (filters.duration?.max && filters.duration.max < 30) {
      params.set('maxDuration', filters.duration.max.toString())
    }
    if (filters.season?.length) params.set('season', filters.season.join(','))
    if (filters.activities?.length) params.set('activities', filters.activities.join(','))
    if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','))
    if (filters.rating) params.set('rating', filters.rating.toString())
    if (filters.verified) params.set('verified', 'true')

    setSearchParams(params)
  }, [filters, searchQuery, setSearchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setCurrentPage(1)
  }

  const toggleWishlist = async (campId: string) => {
    if (!isAuthenticated || !user) return

    const campIsInWishlist = isInWishlist(campId)

    try {
      if (campIsInWishlist) {
        await removeFromWishlist.mutateAsync({ userId: user.id, campId })
      } else {
        await addToWishlist.mutateAsync({ userId: user.id, campId })
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  const difficultyOptions: DifficultyLevel[] = ['easy', 'moderate', 'challenging', 'extreme']
  const seasonOptions: Season[] = ['spring', 'summer', 'monsoon', 'autumn', 'winter']
  const activityOptions = ['Trekking', 'Camping', 'Photography', 'Wildlife', 'Adventure Sports', 'Cultural', 'Wellness']
  const amenityOptions = ['WiFi', 'Meals', 'Transport', 'Guide', 'Equipment', 'First Aid', 'Parking']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Discover Amazing Camps
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {campsResponse?.total || 0} camping experiences across India
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 pr-4"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            "lg:w-80 lg:flex-shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Price Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange?.min || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: parseInt(e.target.value) || 0 }
                      }))}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange?.max || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: parseInt(e.target.value) || 50000 }
                      }))}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Difficulty Level
                  </label>
                  <div className="space-y-2">
                    {difficultyOptions.map((difficulty) => (
                      <label key={difficulty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.difficulty?.includes(difficulty) || false}
                          onChange={(e) => {
                            const newDifficulty = e.target.checked
                              ? [...(filters.difficulty || []), difficulty]
                              : (filters.difficulty || []).filter(d => d !== difficulty)
                            setFilters(prev => ({ ...prev, difficulty: newDifficulty }))
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {difficulty}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Duration (Days)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      min="1"
                      value={filters.duration?.min || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        duration: { ...prev.duration, min: parseInt(e.target.value) || 1 }
                      }))}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min="1"
                      value={filters.duration?.max || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        duration: { ...prev.duration, max: parseInt(e.target.value) || 30 }
                      }))}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Best Season
                  </label>
                  <div className="space-y-2">
                    {seasonOptions.map((season) => (
                      <label key={season} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.season?.includes(season) || false}
                          onChange={(e) => {
                            const newSeason = e.target.checked
                              ? [...(filters.season || []), season]
                              : (filters.season || []).filter(s => s !== season)
                            setFilters(prev => ({ ...prev, season: newSeason }))
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {season}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      rating: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="input-field text-sm"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Verified Only */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verified || false}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        verified: e.target.checked || undefined
                      }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Verified organizers only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'grid'
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'list'
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm min-w-0"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Finding amazing camps..." />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                  Failed to load camps. Please try again.
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : !campsResponse?.camps.length ? (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  No camps found matching your criteria.
                </div>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Camp Grid/List */}
                <div className={cn(
                  viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                )}>
                  {campsResponse.camps.map((camp) => {
                    const campIsInWishlist = isInWishlist(camp.id)

                    return (
                      <div
                        key={camp.id}
                        className={cn(
                          "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 group",
                          viewMode === 'list' && "flex"
                        )}
                      >
                        {/* Image */}
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'grid' ? "aspect-[4/3]" : "w-80 flex-shrink-0 aspect-[4/3]"
                        )}>
                          <img
                            src={camp.images.find(img => img.isPrimary)?.url}
                            alt={camp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Overlay Elements */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {camp.featured && (
                              <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                            {camp.verified && (
                              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Verified
                              </span>
                            )}
                          </div>

                          <div className="absolute top-3 right-3 flex space-x-2">
                            {/* Rating */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{camp.rating.average}</span>
                            </div>

                            {/* Wishlist */}
                            {isAuthenticated && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleWishlist(camp.id)
                                }}
                                className={cn(
                                  "p-2 rounded-full backdrop-blur-sm transition-colors",
                                  campIsInWishlist
                                    ? "bg-red-500 text-white"
                                    : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
                                )}
                              >
                                <Heart className={cn("w-4 h-4", campIsInWishlist && "fill-current")} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <Link
                                to={`/camps/${camp.id}`}
                                className="block group-hover:text-primary-600 transition-colors"
                              >
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                  {camp.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {camp.location.name}, {camp.location.state}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {camp.shortDescription}
                          </p>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDuration(camp.duration.days, camp.duration.nights)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{formatGroupSize(camp.groupSize.min, camp.groupSize.max)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                camp.difficulty === 'easy' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                                camp.difficulty === 'moderate' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                                camp.difficulty === 'challenging' && "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
                                camp.difficulty === 'extreme' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              )}>
                                {camp.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{camp.rating.count} reviews</span>
                            </div>
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(camp.pricing.basePrice)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">per person</div>
                            </div>
                            <Link
                              to={`/camps/${camp.id}`}
                              className="btn-primary"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {campsResponse.total > 12 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(campsResponse.total / 12) }, (_, i) => i + 1)
                          .filter(page =>
                            page === 1 ||
                            page === Math.ceil(campsResponse.total / 12) ||
                            Math.abs(page - currentPage) <= 2
                          )
                          .map((page, index, array) => (
                            <div key={page} className="flex items-center">
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                  page === currentPage
                                    ? "bg-primary-600 text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                )}
                              >
                                {page}
                              </button>
                            </div>
                          ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(campsResponse.total / 12), prev + 1))}
                        disabled={currentPage === Math.ceil(campsResponse.total / 12)}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampsPage
