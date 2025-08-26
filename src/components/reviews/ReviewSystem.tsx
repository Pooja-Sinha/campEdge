import { useState } from 'react'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Camera, 
  X,
  Send,
  Filter,
  SortDesc,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/format'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  images: Array<{
    url: string
    caption?: string
  }>
  helpful: number
  verified: boolean
  tripDate: string
  createdAt: string
  organizerResponse?: {
    content: string
    respondedAt: string
    respondedBy: string
  }
}

interface ReviewSystemProps {
  campId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
  canReview?: boolean
  onSubmitReview?: (review: any) => void
  onHelpfulClick?: (reviewId: string, helpful: boolean) => void
  onReportReview?: (reviewId: string, reason: string) => void
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Review must be at least 20 characters'),
  pros: z.string().optional(),
  cons: z.string().optional(),
  tripDate: z.string().min(1, 'Please select your trip date'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

const ReviewSystem = ({
  campId,
  reviews,
  averageRating,
  totalReviews,
  canReview = false,
  onSubmitReview,
  onHelpfulClick,
  onReportReview
}: ReviewSystemProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      content: '',
      pros: '',
      cons: '',
      tripDate: '',
    }
  })

  const watchedRating = watch('rating')

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => filterBy === 'all' || review.rating.toString() === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const reviewData = {
        ...data,
        pros: data.pros?.split(',').map(p => p.trim()).filter(Boolean) || [],
        cons: data.cons?.split(',').map(c => c.trim()).filter(Boolean) || [],
        images: selectedImages, // In real app, would upload these first
      }
      
      await onSubmitReview?.(reviewData)
      reset()
      setSelectedImages([])
      setShowReviewForm(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)) // Max 5 images
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setValue('rating', star) : undefined}
            className={cn(
              sizeClasses[size],
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
            )}
            disabled={!interactive}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </div>
              <div>
                {renderStars(averageRating, 'lg')}
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on {totalReviews} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        {canReview && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Write Your Review
            </h3>
            <button
              onClick={() => setShowReviewForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(watchedRating, 'lg', true)}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {watchedRating > 0 && (
                    watchedRating === 5 ? 'Excellent' :
                    watchedRating === 4 ? 'Very Good' :
                    watchedRating === 3 ? 'Good' :
                    watchedRating === 2 ? 'Fair' : 'Poor'
                  )}
                </span>
              </div>
              {errors.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Trip Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                When did you visit? *
              </label>
              <input
                type="date"
                {...register('tripDate')}
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.tripDate && (
                <p className="text-red-600 text-sm mt-1">{errors.tripDate.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Title *
              </label>
              <input
                {...register('title')}
                placeholder="Summarize your experience"
                className="input-field"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review *
              </label>
              <textarea
                {...register('content')}
                rows={5}
                placeholder="Share your experience with other travelers..."
                className="input-field"
              />
              {errors.content && (
                <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What did you like? (Optional)
                </label>
                <textarea
                  {...register('pros')}
                  rows={3}
                  placeholder="Separate with commas"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What could be improved? (Optional)
                </label>
                <textarea
                  {...register('cons')}
                  rows={3}
                  placeholder="Separate with commas"
                  className="input-field"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload photos (Max 5)
                  </span>
                </label>
              </div>

              {/* Selected Images */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reviews ({filteredAndSortedReviews.length})
          </h3>
          
          <div className="flex space-x-3">
            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="input-field text-sm"
            >
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        {filteredAndSortedReviews.length > 0 ? (
          <div className="space-y-6">
            {filteredAndSortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=059669&color=fff`}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        {renderStars(review.rating, 'sm')}
                        <span>•</span>
                        <span>{formatDate(review.createdAt)}</span>
                        <span>•</span>
                        <span>Visited {formatDate(review.tripDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.title}
                  </h4>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.content}
                  </p>

                  {/* Pros and Cons */}
                  {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {review.pros.length > 0 && (
                        <div>
                          <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">
                            👍 Liked
                          </h5>
                          <ul className="space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {review.cons.length > 0 && (
                        <div>
                          <h5 className="font-medium text-orange-700 dark:text-orange-400 mb-2">
                            👎 Could improve
                          </h5>
                          <ul className="space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={image.caption || `Review image ${index + 1}`}
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onHelpfulClick?.(review.id, true)}
                      className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>

                {/* Organizer Response */}
                {review.organizerResponse && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-900 dark:text-blue-300">
                        Response from Organizer
                      </span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {formatDate(review.organizerResponse.respondedAt)}
                      </span>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200">
                      {review.organizerResponse.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewSystem
