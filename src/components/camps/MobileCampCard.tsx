import { 
  Heart, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  ExternalLink
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTouchGestures } from '../../hooks/useTouchGestures'
import type { Camp } from '../../types'
import { cn } from '../../utils/cn'
import { formatCurrency, formatDuration } from '../../utils/format'

interface MobileCampCardProps {
  camp: Camp
  onWishlistToggle?: (campId: string) => void
  isInWishlist?: boolean
  className?: string
}

const MobileCampCard = ({ 
  camp, 
  onWishlistToggle, 
  isInWishlist = false,
  className 
}: MobileCampCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const images = camp.images.filter(img => img.url)

  // Touch gestures for image swiping
  const { attachListeners } = useTouchGestures({
    onSwipe: (gesture) => {
      if (gesture.direction === 'left' && currentImageIndex < images.length - 1) {
        setCurrentImageIndex(prev => prev + 1)
      } else if (gesture.direction === 'right' && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1)
      }
    },
    onTap: () => {
      // Navigate to camp detail on tap
      // This will be handled by the Link wrapper
    }
  }, {
    swipeThreshold: 30,
    preventDefault: false
  })

  // Attach touch listeners to image container
  useEffect(() => {
    if (imageContainerRef.current) {
      const cleanup = attachListeners(imageContainerRef.current)
      return cleanup
    }
    return undefined
  }, [attachListeners])

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle?.(camp.id)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (navigator.share) {
      navigator.share({
        title: camp.title,
        text: camp.description,
        url: `${window.location.origin  }/camps/${camp.id}`,
      }).catch(console.error)
    } else {
      setShowShareMenu(!showShareMenu)
    }
  }

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(`${window.location.origin  }/camps/${camp.id}`)
      setShowShareMenu(false)
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'challenging': return 'bg-orange-500'
      case 'extreme': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div 
      ref={cardRef}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden",
        "transform transition-all duration-200 active:scale-95",
        className
      )}
    >
      <Link to={`/camps/${camp.id}`} className="block">
        {/* Image Section */}
        <div 
          ref={imageContainerRef}
          className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700"
        >
          {/* Main Image */}
          <img
            src={images[currentImageIndex]?.url}
            alt={images[currentImageIndex]?.alt || camp.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />

          {/* Loading Skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-opacity hover:bg-opacity-70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Next Button */}
              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-opacity hover:bg-opacity-70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      index === currentImageIndex 
                        ? "bg-white" 
                        : "bg-white bg-opacity-50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Difficulty Badge */}
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium text-white",
              getDifficultyColor(camp.difficulty)
            )}>
              {camp.difficulty}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-opacity hover:bg-opacity-70"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all",
                  isInWishlist 
                    ? "bg-red-500 text-white" 
                    : "bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                )}
              >
                <Heart className={cn("w-4 h-4", isInWishlist && "fill-current")} />
              </button>
            </div>
          </div>

          {/* Featured Badge */}
          {camp.featured && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 flex-1 mr-2">
              {camp.title}
            </h3>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {camp.rating.average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">
              {camp.location.name}, {camp.location.state}
            </span>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formatDuration(camp.duration.days, camp.duration.nights)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {camp.groupSize.min}-{camp.groupSize.max}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {camp.bestTimeToVisit[0]}
              </span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(camp.pricing.basePrice)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  /person
                </span>
              </div>
              {camp.pricing.groupDiscounts.length > 0 && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  Group discounts available
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {camp.availableSlots?.length || 0} slots
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MobileCampCard
