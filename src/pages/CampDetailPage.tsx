import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  Clock,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Shield,
  Award,
  Phone,
  Mail,
  Globe,
  Mountain,
  Thermometer,
  Cloud,
  Plane,
  Train,
  Bus,
  CheckCircle,
  X,
  Plus,
  Minus
} from 'lucide-react'
import { useCamp, useWishlist, useIsInWishlist } from '../hooks/useCamps'
import { useIsAuthenticated } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatDuration, formatGroupSize, formatDate } from '../utils/format'
import { cn } from '../utils/cn'

const CampDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [participants, setParticipants] = useState(1)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const { isAuthenticated, user } = useIsAuthenticated()
  const { addToWishlist, removeFromWishlist } = useWishlist()

  const { data: campResponse, isLoading, error } = useCamp(id || '')

  const camp = campResponse?.success ? campResponse.data : null
  const isInWishlist = useIsInWishlist(user?.id, camp?.id || '')

  const toggleWishlist = async () => {
    if (!isAuthenticated || !user || !camp) return

    try {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync({ userId: user.id, campId: camp.id })
      } else {
        await addToWishlist.mutateAsync({ userId: user.id, campId: camp.id })
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && camp) {
      try {
        await navigator.share({
          title: camp.title,
          text: camp.shortDescription,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const nextImage = () => {
    if (camp) {
      setCurrentImageIndex((prev) => (prev + 1) % camp.images.length)
    }
  }

  const prevImage = () => {
    if (camp) {
      setCurrentImageIndex((prev) => (prev - 1 + camp.images.length) % camp.images.length)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!selectedSlot) {
      alert('Please select a date first')
      return
    }
    navigate(`/booking/${camp?.id}?slot=${selectedSlot}&participants=${participants}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading camp details..." />
      </div>
    )
  }

  if (error || !camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Camp Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The camp you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/camps" className="btn-primary">
            Browse All Camps
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {isAuthenticated && (
                <button
                  onClick={toggleWishlist}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isInWishlist
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden">
          <img
            src={camp.images[currentImageIndex]?.url}
            alt={camp.images[currentImageIndex]?.alt}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {camp.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {camp.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {camp.featured && (
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
            {camp.verified && (
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium">{camp.rating.average}</span>
            <span className="text-gray-600">({camp.rating.count})</span>
          </div>
        </div>

        {/* View All Images Button */}
        {camp.images.length > 1 && (
          <button
            onClick={() => setShowAllImages(true)}
            className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>View All {camp.images.length} Photos</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="container-max section-padding py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {camp.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>{camp.location.name}, {camp.location.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDuration(camp.duration.days, camp.duration.nights)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>{formatGroupSize(camp.groupSize.min, camp.groupSize.max)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mountain className="w-5 h-5" />
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
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {camp.description}
              </p>
            </div>

            {/* Organizer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Meet Your Organizer
              </h3>

              <div className="flex items-start space-x-4">
                <img
                  src={camp.organizer.avatar}
                  alt={camp.organizer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {camp.organizer.name}
                    </h4>
                    {camp.organizer.verified && (
                      <Award className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{camp.organizer.rating.average} ({camp.organizer.rating.count} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{camp.organizer.experience} years experience</span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {camp.organizer.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {camp.organizer.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    {camp.organizer.contact.phone && (
                      <a
                        href={`tel:${camp.organizer.contact.phone}`}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </a>
                    )}
                    {camp.organizer.contact.email && (
                      <a
                        href={`mailto:${camp.organizer.contact.email}`}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </a>
                    )}
                    {camp.organizer.contact.website && (
                      <a
                        href={camp.organizer.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Day-by-Day Itinerary
              </h3>

              <div className="space-y-6">
                {camp.itinerary.map((day) => (
                  <div key={day.day} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {day.day}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {day.title}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {day.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Activities:</span>
                          <ul className="text-gray-600 dark:text-gray-400 mt-1">
                            {day.activities.map((activity, index) => (
                              <li key={index}>• {activity}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Highlights:</span>
                          <ul className="text-gray-600 dark:text-gray-400 mt-1">
                            {day.highlights.map((highlight, index) => (
                              <li key={index}>• {highlight}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>🏠 {day.accommodation}</span>
                        <span>🍽️ {day.meals.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Activities & Experiences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {camp.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {activity.name}
                      </h4>
                      {activity.included ? (
                        <span className="text-green-600 text-sm font-medium">Included</span>
                      ) : (
                        <span className="text-orange-600 text-sm font-medium">
                          +{formatCurrency(activity.additionalCost || 0)}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>⏱️ {activity.duration}</span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        activity.difficulty === 'easy' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                        activity.difficulty === 'moderate' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                        activity.difficulty === 'challenging' && "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
                        activity.difficulty === 'extreme' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      )}>
                        {activity.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                What's Included
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {camp.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {amenity.name}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(camp.pricing.basePrice)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">per person</div>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Date
                  </label>
                  <div className="space-y-2">
                    {camp.availability.slots.map((slot) => (
                      <label
                        key={slot.id}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                          selectedSlot === slot.id
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        )}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selectedSlot === slot.id}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(slot.startDate)} - {formatDate(slot.endDate)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {slot.availableSpots} spots available
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(slot.price)}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Participants
                  </label>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <span className="text-gray-900 dark:text-white">Adults</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                        disabled={participants <= 1}
                        className="p-1 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{participants}</span>
                      <button
                        onClick={() => setParticipants(Math.min(camp.groupSize.max, participants + 1))}
                        disabled={participants >= camp.groupSize.max}
                        className="p-1 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                {selectedSlot && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(camp.pricing.basePrice)} × {participants} person{participants > 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(camp.pricing.basePrice * participants)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  disabled={!selectedSlot}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {!isAuthenticated ? 'Login to Book' : 'Book Now'}
                </button>

                {/* Additional Info */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>✅ Free cancellation up to 7 days</p>
                  <p>🛡️ 100% secure payment</p>
                  <p>📞 24/7 customer support</p>
                </div>
              </div>

              {/* Weather Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Cloud className="w-5 h-5" />
                  <span>Weather Info</span>
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {camp.weatherInfo.temperature.min}°C - {camp.weatherInfo.temperature.max}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rainfall</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {camp.weatherInfo.rainfall}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Best Season</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {camp.bestTimeToVisit.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transport Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  How to Reach
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Plane className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {camp.transportInfo.nearestAirport.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {camp.transportInfo.nearestAirport.distance} km away
                      </div>
                    </div>
                  </div>

                  {camp.transportInfo.nearestRailway.name && (
                    <div className="flex items-start space-x-3">
                      <Train className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {camp.transportInfo.nearestRailway.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {camp.transportInfo.nearestRailway.distance} km away
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Bus className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {camp.transportInfo.nearestBusStop.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {camp.transportInfo.nearestBusStop.distance} km away
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-8">
          {/* Pricing Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Pricing & Inclusions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's Included</h4>
                <ul className="space-y-2">
                  {camp.pricing.includes.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's Not Included</h4>
                <ul className="space-y-2">
                  {camp.pricing.excludes.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {camp.pricing.groupDiscounts.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Group Discounts</h4>
                {camp.pricing.groupDiscounts.map((discount, index) => (
                  <p key={index} className="text-green-700 dark:text-green-300 text-sm">
                    {discount.discountPercentage}% off for groups of {discount.minSize}+ people
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Packing List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Packing Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {camp.packingList.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border",
                    item.essential
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.item}
                    </span>
                    {item.essential && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Essential
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.notes}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.provided ? '✅ Provided' : '❌ Bring your own'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Emergency Contacts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camp.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.role}
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {contact.phone}
                    </a>
                    {contact.available24x7 && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Available 24/7
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampDetailPage
