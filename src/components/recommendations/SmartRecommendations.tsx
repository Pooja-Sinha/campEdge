import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Crown,
  Star,
  MapPin,
  ChevronRight,
  RefreshCw,
  Brain
} from 'lucide-react'
import { recommendationService, SmartRecommendations as RecommendationsData } from '../../services/recommendationService'
import { useIsAuthenticated } from '../../hooks/useAuth'
import { useCampsStore } from '../../store/campsStore'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/format'

interface SmartRecommendationsProps {
  className?: string
  maxItems?: number
  showAllCategories?: boolean
}

const SmartRecommendations = ({ 
  className,
  maxItems = 4,
  showAllCategories = true
}: SmartRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<keyof RecommendationsData>('personalizedCamps')
  const { user, isAuthenticated } = useIsAuthenticated()
  const { camps } = useCampsStore()

  useEffect(() => {
    loadRecommendations()
  }, [user, isAuthenticated])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      const data = await recommendationService.getSmartRecommendations(
        user || undefined,
        undefined,
        {
          season: getCurrentSeason(),
          groupSize: 4
        }
      )
      setRecommendations(data)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'autumn'
    return 'winter'
  }

  const getCampById = (campId: string) => {
    return camps.find(camp => camp.id === campId)
  }

  const categories = [
    {
      key: 'personalizedCamps' as keyof RecommendationsData,
      title: 'For You',
      icon: Sparkles,
      description: 'Personalized based on your preferences',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    },
    {
      key: 'trendingCamps' as keyof RecommendationsData,
      title: 'Trending',
      icon: TrendingUp,
      description: 'Popular with recent travelers',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      key: 'similarUsersCamps' as keyof RecommendationsData,
      title: 'Similar Travelers',
      icon: Users,
      description: 'Loved by users like you',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      key: 'seasonalRecommendations' as keyof RecommendationsData,
      title: 'Seasonal',
      icon: Calendar,
      description: 'Perfect for this season',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    },
    {
      key: 'budgetFriendly' as keyof RecommendationsData,
      title: 'Budget Friendly',
      icon: DollarSign,
      description: 'Great value for money',
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20'
    },
    {
      key: 'premiumExperiences' as keyof RecommendationsData,
      title: 'Premium',
      icon: Crown,
      description: 'Luxury experiences',
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    }
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!recommendations) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Unable to Load Recommendations
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We couldn't generate personalized recommendations right now.
        </p>
        <button
          onClick={loadRecommendations}
          className="btn-primary flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    )
  }

  const activeRecommendations = recommendations[activeCategory]?.slice(0, maxItems) || []
  const activeCategory_info = categories.find(cat => cat.key === activeCategory)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Smart Recommendations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered suggestions just for you
            </p>
          </div>
        </div>
        
        <button
          onClick={loadRecommendations}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Category Tabs */}
      {showAllCategories && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.key
            const Icon = category.icon
            
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all",
                  isActive
                    ? category.color + " font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.title}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Active Category Info */}
      {activeCategory_info && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <activeCategory_info.icon className="w-4 h-4" />
          <span>{activeCategory_info.description}</span>
        </div>
      )}

      {/* Recommendations Grid */}
      {activeRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeRecommendations.map((recommendation) => {
            const camp = getCampById(recommendation.campId)
            if (!camp) return null

            return (
              <Link
                key={recommendation.campId}
                to={`/camps/${camp.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={camp.images[0]?.url}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 flex-1 mr-2">
                      {camp.title}
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {camp.rating.average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs truncate">
                      {camp.location.name}, {camp.location.state}
                    </span>
                  </div>

                  {/* AI Confidence */}
                  <div className={cn(
                    "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mb-3",
                    getConfidenceColor(recommendation.confidence)
                  )}>
                    <Brain className="w-3 h-3" />
                    <span>{Math.round(recommendation.confidence * 100)}% match</span>
                  </div>

                  {/* Reasons */}
                  <div className="space-y-1 mb-3">
                    {recommendation.reasons.slice(0, 2).map((reason, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-1">
                        <div className="w-1 h-1 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="line-clamp-1">{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(camp.pricing.basePrice)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                        /person
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Recommendations Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We're still learning your preferences. Try exploring some camps first!
          </p>
        </div>
      )}

      {/* View All Link */}
      {activeRecommendations.length >= maxItems && (
        <div className="text-center">
          <Link
            to={`/recommendations?category=${activeCategory}`}
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>View All {activeCategory_info?.title} Recommendations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default SmartRecommendations
