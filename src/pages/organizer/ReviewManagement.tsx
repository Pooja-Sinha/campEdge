import {
  Star,
  MessageSquare,
  Flag,
  Search,
  ThumbsUp,
  Reply,
  MoreVertical,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface Review {
  id: string
  customerName: string
  customerAvatar: string
  campId: string
  campName: string
  rating: number
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  images?: string[]
  helpful: number
  verified: boolean
  createdAt: string
  response?: {
    content: string
    createdAt: string
  }
  status: 'pending' | 'approved' | 'flagged'
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  responseRate: number
  pendingReviews: number
}

const ReviewManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'flagged'>('all')
  const [showResponseModal, setShowResponseModal] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  // Mock data
  const reviewStats: ReviewStats = {
    totalReviews: 127,
    averageRating: 4.6,
    ratingDistribution: {
      5: 68,
      4: 32,
      3: 15,
      2: 8,
      1: 4
    },
    responseRate: 85,
    pendingReviews: 5
  }

  const reviews: Review[] = [
    {
      id: 'R001',
      customerName: 'Arjun Sharma',
      customerAvatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=059669&color=fff',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      rating: 5,
      title: 'Amazing experience with breathtaking views!',
      content: 'The trek was well organized and the camping experience was fantastic. The guides were knowledgeable and the food was delicious. Highly recommend this adventure to anyone looking for a memorable mountain experience.',
      pros: ['Great guides', 'Beautiful location', 'Good food'],
      cons: ['Weather was unpredictable'],
      images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=150&fit=crop'],
      helpful: 12,
      verified: true,
      createdAt: '2024-11-15T10:30:00Z',
      response: {
        content: 'Thank you so much for your wonderful review, Arjun! We\'re thrilled that you enjoyed the trek and camping experience. We always strive to provide the best guides and delicious meals. We hope to see you on another adventure soon!',
        createdAt: '2024-11-15T14:20:00Z'
      },
      status: 'approved'
    },
    {
      id: 'R002',
      customerName: 'Sneha Patel',
      customerAvatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=059669&color=fff',
      campId: 'C002',
      campName: 'Desert Safari Experience',
      rating: 4,
      title: 'Great desert adventure',
      content: 'The desert safari was exciting and well-planned. The camel ride was a highlight, and the sunset views were spectacular. The camp setup was comfortable and the staff was friendly.',
      pros: ['Exciting safari', 'Beautiful sunset', 'Comfortable camp'],
      cons: ['A bit expensive'],
      helpful: 8,
      verified: true,
      createdAt: '2024-11-14T15:20:00Z',
      status: 'pending'
    },
    {
      id: 'R003',
      customerName: 'Vikram Singh',
      customerAvatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=059669&color=fff',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      rating: 2,
      title: 'Disappointing experience',
      content: 'The trek was poorly organized and the equipment was old. The food quality was below average and the guides seemed inexperienced. Would not recommend.',
      pros: ['Nice location'],
      cons: ['Poor organization', 'Old equipment', 'Bad food', 'Inexperienced guides'],
      helpful: 3,
      verified: false,
      createdAt: '2024-11-13T09:45:00Z',
      status: 'flagged'
    }
  ]

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.campName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    return matchesSearch && matchesRating && matchesStatus
  })



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'flagged': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300 dark:text-gray-600"
        )}
      />
    ))
  }

  const handleResponse = (reviewId: string) => {
    setShowResponseModal(reviewId)
    const review = reviews.find(r => r.id === reviewId)
    setResponseText(review?.response?.content || '')
  }

  const submitResponse = () => {
    console.log('Submit response for review:', showResponseModal, 'Content:', responseText)
    setShowResponseModal(null)
    setResponseText('')
  }

  const flagReview = (reviewId: string) => {
    console.log('Flag review:', reviewId)
  }

  const approveReview = (reviewId: string) => {
    console.log('Approve review:', reviewId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Review Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer reviews and build your reputation
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviewStats.totalReviews}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reviewStats.averageRating.toFixed(1)}
                </p>
                <div className="flex">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviewStats.responseRate}%
              </p>
            </div>
            <Reply className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviewStats.pendingReviews}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rating Distribution
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewStats.ratingDistribution[rating] || 0
            const percentage = (count / reviewStats.totalReviews) * 100
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-900 dark:text-white text-right">
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {review.customerName}
                    </h4>
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(review.status)
                    )}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {review.status === 'pending' && (
                  <button
                    onClick={() => approveReview(review.id)}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    title="Approve Review"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => flagReview(review.id)}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  title="Flag Review"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Camp Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Review for: <span className="font-medium text-gray-900 dark:text-white">{review.campName}</span>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {review.title}
              </h5>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {review.content}
              </p>

              {/* Pros and Cons */}
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  {review.pros && review.pros.length > 0 && (
                    <div>
                      <h6 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                        Pros:
                      </h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons && review.cons.length > 0 && (
                    <div>
                      <h6 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                        Cons:
                      </h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful} helpful</span>
                </div>
              </div>
              <button
                onClick={() => handleResponse(review.id)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
              >
                <Reply className="w-4 h-4" />
                <span>{review.response ? 'Edit Response' : 'Respond'}</span>
              </button>
            </div>

            {/* Existing Response */}
            {review.response && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-400">
                    Your Response
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {formatDate(review.response.createdAt)}
                  </div>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {review.response.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search criteria' : 'Customer reviews will appear here'}
          </p>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Respond to Review
            </h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              rows={6}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowResponseModal(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitResponse}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewManagement
