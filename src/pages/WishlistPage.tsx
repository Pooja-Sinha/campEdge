import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  Star,
  MapPin,
  Users,
  Calendar,
  Trash2,
  Eye,
  Share2,
  Grid3X3,
  List,
  Filter,
  Search
} from 'lucide-react'
import { useIsAuthenticated } from '../hooks/useAuth'
import { useUserWishlist, useWishlist } from '../hooks/useCamps'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatDuration } from '../utils/format'
import { cn } from '../utils/cn'

const WishlistPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const navigate = useNavigate()

  const { isAuthenticated, user } = useIsAuthenticated()
  const { data: wishlistResponse, isLoading } = useUserWishlist(user?.id || '', !!user?.id)
  const { removeFromWishlist } = useWishlist()

  const wishlistItems = wishlistResponse?.success ? wishlistResponse.data : []

  // Filter wishlist items based on search
  const filteredItems = wishlistItems.filter(item =>
    item.camp?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.camp?.location?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort wishlist items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      case 'price-low':
        return (a.camp?.pricing?.basePrice || 0) - (b.camp?.pricing?.basePrice || 0)
      case 'price-high':
        return (b.camp?.pricing?.basePrice || 0) - (a.camp?.pricing?.basePrice || 0)
      case 'rating':
        return (b.camp?.rating?.average || 0) - (a.camp?.rating?.average || 0)
      case 'name':
        return (a.camp?.title || '').localeCompare(b.camp?.title || '')
      default:
        return 0
    }
  })

  const handleRemoveFromWishlist = async (campId: string) => {
    if (!user) return

    try {
      await removeFromWishlist.mutateAsync({ userId: user.id, campId })
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleShare = async (camp: any) => {
    const url = `${window.location.origin}/camps/${camp.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: camp.title,
          text: camp.shortDescription,
          url: url,
        })
      } catch (error) {
        navigator.clipboard.writeText(url)
      }
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to view your wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Save your favorite camps and access them anytime
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {wishlistItems.length} saved camp{wishlistItems.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid'
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list'
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Sort */}
          {wishlistItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Recently Added</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container-max section-padding py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your wishlist..." />
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No camps found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              </>
            ) : wishlistItems.length === 0 ? (
              <>
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start exploring and save camps you're interested in!
                </p>
                <Link to="/camps" className="btn-primary">
                  Browse Camps
                </Link>
              </>
            ) : null}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemoveFromWishlist(item.campId)}
                    onShare={() => item.camp && handleShare(item.camp)}
                    onView={() => navigate(`/camps/${item.campId}`)}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <WishlistListItem
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemoveFromWishlist(item.campId)}
                    onShare={() => item.camp && handleShare(item.camp)}
                    onView={() => navigate(`/camps/${item.campId}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Wishlist Card Component (Grid View)
interface WishlistCardProps {
  item: any
  onRemove: () => void
  onShare: () => void
  onView: () => void
}

const WishlistCard = ({ item, onRemove, onShare, onView }: WishlistCardProps) => {
  const { camp } = item

  if (!camp) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Camp not found</p>
          <button
            onClick={onRemove}
            className="mt-2 text-red-600 hover:text-red-700 text-sm"
          >
            Remove from wishlist
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={camp.images?.find((img: any) => img.isPrimary)?.url || camp.images?.[0]?.url}
          alt={camp.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={onShare}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Badge */}
        {camp.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {camp.title}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {camp.rating?.average?.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{camp.location?.name}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{camp.groupSize?.min}-{camp.groupSize?.max} people</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDuration(camp.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(camp.pricing?.basePrice)}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
              per person
            </span>
          </div>
          <button
            onClick={onView}
            className="btn-primary text-sm px-4 py-2"
          >
            View Details
          </button>
        </div>

        {/* Added Date */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Added {new Date(item.addedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

// Wishlist List Item Component (List View)
const WishlistListItem = ({ item, onRemove, onShare, onView }: WishlistCardProps) => {
  const { camp } = item

  if (!camp) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 dark:text-gray-400">Camp not found</p>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={camp.images?.find((img: any) => img.isPrimary)?.url || camp.images?.[0]?.url}
            alt={camp.title}
            className="w-full h-full object-cover"
          />
          {camp.featured && (
            <div className="absolute top-1 left-1">
              <span className="px-1 py-0.5 bg-primary-600 text-white text-xs font-medium rounded">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">
              {camp.title}
            </h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {camp.rating?.average?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{camp.location?.name}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{camp.groupSize?.min}-{camp.groupSize?.max} people</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDuration(camp.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(camp.pricing?.basePrice)}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                  per person
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onShare}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onRemove}
                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onView}
                className="btn-primary text-sm px-4 py-2"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
