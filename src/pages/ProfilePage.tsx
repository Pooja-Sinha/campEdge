import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Heart,
  BookOpen,
  Star,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Award,
  Clock
} from 'lucide-react'
import { useIsAuthenticated, useAuth } from '../hooks/useAuth'
import { useUserBookings, useUserWishlist } from '../hooks/useCamps'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatDate, formatDuration } from '../utils/format'
import { cn } from '../utils/cn'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'wishlist' | 'settings'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { isAuthenticated, user } = useIsAuthenticated()
  const { updateProfile } = useAuth()
  const { data: bookingsResponse, isLoading: bookingsLoading } = useUserBookings(user?.id || '')
  const { data: wishlistResponse, isLoading: wishlistLoading } = useUserWishlist(user?.id || '', !!user?.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      dateOfBirth: user?.dateOfBirth || '',
      emergencyContact: user?.emergencyContact || {
        name: '',
        phone: '',
        relation: '',
      },
    }
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true)
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        ...data,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const cancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const bookings = bookingsResponse?.success ? bookingsResponse.data : []
  const wishlistItems = wishlistResponse?.success ? wishlistResponse.data : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding py-8">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                {user.verified && (
                  <Shield className="w-6 h-6 text-green-500" />
                )}
                {user.role === 'organizer' && (
                  <Award className="w-6 h-6 text-yellow-500" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              </div>

              {user.bio && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="hidden md:flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {wishlistItems.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Wishlist</div>
              </div>
              {user.role === 'organizer' && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.rating?.average || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-max section-padding py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isUpdating}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('name')}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      {...register('location')}
                      disabled={!isEditing}
                      placeholder="City, State"
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        {...register('emergencyContact.name')}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        {...register('emergencyContact.phone')}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship
                      </label>
                      <input
                        {...register('emergencyContact.relation')}
                        disabled={!isEditing}
                        placeholder="e.g., Father, Mother"
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Bookings
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </div>
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading bookings..." />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start your adventure by booking your first camp!
                </p>
                <a href="/camps" className="btn-primary">
                  Browse Camps
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex space-x-4">
                        <img
                          src={booking.camp?.images?.find(img => img.isPrimary)?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'}
                          alt={booking.camp?.title || 'Camp'}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {booking.camp?.title || 'Unknown Camp'}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.camp.location.name}, {booking.camp.location.state}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(booking.slot.startDate)} - {formatDate(booking.slot.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{booking.participants.length} participant{booking.participants.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2",
                          booking.bookingStatus === 'confirmed' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                          booking.bookingStatus === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                          booking.bookingStatus === 'cancelled' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        )}>
                          {booking.bookingStatus}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Booking ID: {booking.id.slice(-8)}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Booked on {formatDate(booking.createdAt)}
                        </div>
                        <div className="flex space-x-3">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            View Details
                          </button>
                          {booking.bookingStatus === 'confirmed' && (
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Wishlist
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {wishlistItems.length} camp{wishlistItems.length !== 1 ? 's' : ''}
              </div>
            </div>

            {wishlistLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading wishlist..." />
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Save camps you're interested in to your wishlist!
                </p>
                <a href="/camps" className="btn-primary">
                  Browse Camps
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.camp?.images?.find((img: any) => img.isPrimary)?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'}
                        alt={item.camp?.title || 'Camp'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-3 right-3">
                        <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div className="absolute top-3 left-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{item.camp?.rating?.average || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {item.camp?.title || 'Unknown Camp'}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.camp?.location?.name || 'Unknown'}, {item.camp?.location?.state || ''}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{item.camp?.duration ? formatDuration(item.camp.duration.days, item.camp.duration.nights) : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.camp?.pricing?.basePrice || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">per person</div>
                        </div>
                        <a
                          href={`/camps/${item.camp?.id || ''}`}
                          className="btn-primary text-sm"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Receive booking confirmations and updates
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Get important updates via SMS
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Marketing Emails</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Receive newsletters and promotional offers
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Privacy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Profile Visibility</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Make your profile visible to other users
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Show Booking History</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Allow organizers to see your booking history
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Change Password</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Update your account password
                    </div>
                  </button>

                  <button className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Download Data</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Download a copy of your account data
                    </div>
                  </button>

                  <button className="w-full text-left p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <div className="font-medium text-red-600 dark:text-red-400">Delete Account</div>
                    <div className="text-sm text-red-500 dark:text-red-400">
                      Permanently delete your account and all data
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
