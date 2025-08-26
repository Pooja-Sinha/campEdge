import type { Camp, User } from '../types/index'
import { campsData } from '../data/camps_mock_data'

export interface RecommendationScore {
  campId: string
  score: number
  reasons: string[]
  confidence: number
}

export interface SmartRecommendations {
  personalizedCamps: RecommendationScore[]
  trendingCamps: RecommendationScore[]
  similarUsersCamps: RecommendationScore[]
  seasonalRecommendations: RecommendationScore[]
  budgetFriendly: RecommendationScore[]
  premiumExperiences: RecommendationScore[]
}

export interface UserPreferences {
  difficulty: string[]
  activities: string[]
  budget: { min: number; max: number }
  groupSize: number
  preferredSeasons: string[]
  previousBookings: string[]
  wishlist: string[]
  ratings: Record<string, number>
}

class RecommendationService {
  private camps: Camp[] = campsData.camps

  // Main recommendation engine
  async getSmartRecommendations(
    user?: User,
    preferences?: UserPreferences,
    context?: {
      location?: string
      season?: string
      budget?: number
      groupSize?: number
    }
  ): Promise<SmartRecommendations> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const userPrefs = this.buildUserPreferences(user, preferences)
    const contextualFactors = this.analyzeContext(context)

    return {
      personalizedCamps: await this.getPersonalizedRecommendations(userPrefs, contextualFactors),
      trendingCamps: await this.getTrendingRecommendations(),
      similarUsersCamps: await this.getSimilarUsersRecommendations(userPrefs),
      seasonalRecommendations: await this.getSeasonalRecommendations(contextualFactors.season),
      budgetFriendly: await this.getBudgetFriendlyRecommendations(userPrefs.budget),
      premiumExperiences: await this.getPremiumRecommendations()
    }
  }

  // Personalized recommendations based on user profile and behavior
  private async getPersonalizedRecommendations(
    preferences: UserPreferences,
    context: any
  ): Promise<RecommendationScore[]> {
    const scores = this.camps.map(camp => {
      let score = 0
      const reasons: string[] = []

      // Difficulty preference matching (25% weight)
      if (preferences.difficulty.includes(camp.difficulty)) {
        score += 25
        reasons.push(`Matches your ${camp.difficulty} difficulty preference`)
      }

      // Activity preference matching (30% weight)
      const matchingActivities = camp.activities.filter(activity =>
        preferences.activities.some(pref => 
          activity.name.toLowerCase().includes(pref.toLowerCase())
        )
      )
      if (matchingActivities.length > 0) {
        const activityScore = (matchingActivities.length / camp.activities.length) * 30
        score += activityScore
        reasons.push(`Features ${matchingActivities.length} of your favorite activities`)
      }

      // Budget compatibility (20% weight)
      if (camp.pricing.basePrice >= preferences.budget.min && 
          camp.pricing.basePrice <= preferences.budget.max) {
        score += 20
        reasons.push('Fits your budget perfectly')
      } else if (camp.pricing.basePrice < preferences.budget.max * 1.2) {
        score += 10
        reasons.push('Slightly above budget but great value')
      }

      // Seasonal preference (15% weight)
      const seasonalMatch = camp.bestTimeToVisit.some(season =>
        preferences.preferredSeasons.includes(season)
      )
      if (seasonalMatch) {
        score += 15
        reasons.push('Perfect for your preferred travel season')
      }

      // Previous booking patterns (10% weight)
      const hasBookedSimilar = preferences.previousBookings.some(bookingId => {
        const bookedCamp = this.camps.find(c => c.id === bookingId)
        return bookedCamp && this.areCampsSimilar(camp, bookedCamp)
      })
      if (hasBookedSimilar) {
        score += 10
        reasons.push('Similar to camps you\'ve enjoyed before')
      }

      // Exclude camps already in wishlist or booked
      if (preferences.wishlist.includes(camp.id) || 
          preferences.previousBookings.includes(camp.id)) {
        score = 0
        reasons.length = 0
      }

      // Boost featured camps slightly
      if (camp.featured) {
        score += 5
        reasons.push('Featured experience')
      }

      // Rating boost
      if (camp.rating.average >= 4.5) {
        score += 5
        reasons.push('Highly rated by travelers')
      }

      return {
        campId: camp.id,
        score,
        reasons,
        confidence: Math.min(score / 100, 1)
      }
    })

    return scores
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }

  // Trending camps based on recent bookings and ratings
  private async getTrendingRecommendations(): Promise<RecommendationScore[]> {
    const trendingFactors = this.camps.map(camp => {
      let score = 0
      const reasons: string[] = []

      // Recent rating activity (simulated)
      if (camp.rating.count > 50) {
        score += 30
        reasons.push('Popular with recent travelers')
      }

      // High rating
      if (camp.rating.average >= 4.5) {
        score += 25
        reasons.push('Excellent reviews')
      }

      // Featured status
      if (camp.featured) {
        score += 20
        reasons.push('Featured destination')
      }

      // Seasonal relevance
      const currentMonth = new Date().toLocaleString('default', { month: 'long' })
      if (camp.bestTimeToVisit.includes(currentMonth.toLowerCase())) {
        score += 15
        reasons.push('Perfect timing for this season')
      }

      // Availability
      if (camp.availableSlots.length > 3) {
        score += 10
        reasons.push('Good availability')
      }

      return {
        campId: camp.id,
        score,
        reasons,
        confidence: Math.min(score / 100, 1)
      }
    })

    return trendingFactors
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  // Recommendations based on similar users' preferences
  private async getSimilarUsersRecommendations(
    preferences: UserPreferences
  ): Promise<RecommendationScore[]> {
    // Simulate collaborative filtering
    const similarUserCamps = this.camps.map(camp => {
      let score = 0
      const reasons: string[] = []

      // Users with similar preferences also liked these camps
      if (camp.rating.average >= 4.0) {
        score += 40
        reasons.push('Loved by users with similar preferences')
      }

      // Activity overlap with user preferences
      const activityMatch = camp.activities.some(activity =>
        preferences.activities.includes(activity.name)
      )
      if (activityMatch) {
        score += 30
        reasons.push('Matches your activity interests')
      }

      // Difficulty alignment
      if (preferences.difficulty.includes(camp.difficulty)) {
        score += 20
        reasons.push('Right difficulty level for you')
      }

      // Hidden gems (lower booking count but high rating)
      if (camp.rating.count < 30 && camp.rating.average >= 4.5) {
        score += 10
        reasons.push('Hidden gem discovered by similar travelers')
      }

      return {
        campId: camp.id,
        score,
        reasons,
        confidence: Math.min(score / 100, 1)
      }
    })

    return similarUserCamps
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  // Seasonal recommendations
  private async getSeasonalRecommendations(season?: string): Promise<RecommendationScore[]> {
    const currentSeason = season || this.getCurrentSeason()
    
    const seasonalCamps = this.camps.map(camp => {
      let score = 0
      const reasons: string[] = []

      // Perfect season match
      if (camp.bestTimeToVisit.includes(currentSeason)) {
        score += 50
        reasons.push(`Perfect for ${currentSeason} season`)
      }

      // Weather considerations
      if (currentSeason === 'winter' && camp.location.state.includes('Himachal')) {
        score += 20
        reasons.push('Great winter mountain experience')
      } else if (currentSeason === 'summer' && camp.location.state.includes('Karnataka')) {
        score += 20
        reasons.push('Cool summer retreat')
      }

      // Seasonal activities
      const seasonalActivities = this.getSeasonalActivities(currentSeason)
      const hasSeasonalActivity = camp.activities.some(activity =>
        seasonalActivities.includes(activity.name.toLowerCase())
      )
      if (hasSeasonalActivity) {
        score += 15
        reasons.push('Features seasonal activities')
      }

      return {
        campId: camp.id,
        score,
        reasons,
        confidence: Math.min(score / 100, 1)
      }
    })

    return seasonalCamps
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  // Budget-friendly recommendations
  private async getBudgetFriendlyRecommendations(
    budget: { min: number; max: number }
  ): Promise<RecommendationScore[]> {
    const budgetCamps = this.camps
      .filter(camp => camp.pricing.basePrice <= budget.max * 0.8)
      .map(camp => {
        let score = 0
        const reasons: string[] = []

        // Value for money
        const valueScore = (camp.rating.average / (camp.pricing.basePrice / 1000)) * 20
        score += valueScore
        reasons.push('Excellent value for money')

        // Group discounts available
        if (camp.pricing.groupDiscounts.length > 0) {
          score += 15
          reasons.push('Group discounts available')
        }

        // High rating despite low price
        if (camp.rating.average >= 4.0) {
          score += 25
          reasons.push('High quality at budget price')
        }

        // Includes meals/equipment
        if (camp.inclusions.includes('Meals') || camp.inclusions.includes('Equipment')) {
          score += 10
          reasons.push('Great inclusions for the price')
        }

        return {
          campId: camp.id,
          score,
          reasons,
          confidence: Math.min(score / 100, 1)
        }
      })

    return budgetCamps
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  // Premium experience recommendations
  private async getPremiumRecommendations(): Promise<RecommendationScore[]> {
    const premiumCamps = this.camps
      .filter(camp => camp.pricing.basePrice >= 5000)
      .map(camp => {
        let score = 0
        const reasons: string[] = []

        // High price indicates premium
        if (camp.pricing.basePrice >= 10000) {
          score += 30
          reasons.push('Luxury camping experience')
        }

        // Exceptional rating
        if (camp.rating.average >= 4.7) {
          score += 25
          reasons.push('Exceptional guest reviews')
        }

        // Unique activities
        const uniqueActivities = ['helicopter ride', 'private guide', 'gourmet meals']
        const hasUniqueActivity = camp.activities.some(activity =>
          uniqueActivities.some(unique => 
            activity.name.toLowerCase().includes(unique)
          )
        )
        if (hasUniqueActivity) {
          score += 20
          reasons.push('Exclusive premium activities')
        }

        // Remote/exclusive location
        if (camp.location.state.includes('Ladakh') || camp.difficulty === 'extreme') {
          score += 15
          reasons.push('Exclusive remote location')
        }

        return {
          campId: camp.id,
          score,
          reasons,
          confidence: Math.min(score / 100, 1)
        }
      })

    return premiumCamps
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }

  // Helper methods
  private buildUserPreferences(user?: User, preferences?: UserPreferences): UserPreferences {
    return {
      difficulty: preferences?.difficulty || ['easy', 'moderate'],
      activities: preferences?.activities || ['trekking', 'photography'],
      budget: preferences?.budget || { min: 1000, max: 10000 },
      groupSize: preferences?.groupSize || 4,
      preferredSeasons: preferences?.preferredSeasons || ['autumn', 'winter'],
      previousBookings: preferences?.previousBookings || [],
      wishlist: preferences?.wishlist || [],
      ratings: preferences?.ratings || {}
    }
  }

  private analyzeContext(context?: any) {
    return {
      location: context?.location || '',
      season: context?.season || this.getCurrentSeason(),
      budget: context?.budget || 5000,
      groupSize: context?.groupSize || 4
    }
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'autumn'
    return 'winter'
  }

  private getSeasonalActivities(season: string): string[] {
    switch (season) {
      case 'winter':
        return ['skiing', 'snow trekking', 'winter sports', 'hot springs']
      case 'summer':
        return ['water sports', 'swimming', 'beach activities', 'river rafting']
      case 'monsoon':
        return ['waterfall trekking', 'rain forest', 'indoor activities']
      default:
        return ['trekking', 'photography', 'wildlife', 'camping']
    }
  }

  private areCampsSimilar(camp1: Camp, camp2: Camp): boolean {
    // Check similarity based on activities, difficulty, and location
    const activityOverlap = camp1.activities.some(a1 =>
      camp2.activities.some(a2 => a1.name === a2.name)
    )
    const sameDifficulty = camp1.difficulty === camp2.difficulty
    const sameState = camp1.location.state === camp2.location.state

    return activityOverlap && (sameDifficulty || sameState)
  }
}

export const recommendationService = new RecommendationService()
