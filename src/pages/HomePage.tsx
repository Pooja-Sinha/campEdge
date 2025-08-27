import { Search, MapPin, Star, Users, Calendar, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useFeaturedCamps } from '../hooks/useCamps'

const HomePage = () => {
  const { data: featuredResponse, isLoading, error } = useFeaturedCamps()
  const navigate = useNavigate()

  // Search form state
  const [searchForm, setSearchForm] = useState({
    destination: '',
    checkIn: '',
    groupSize: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    // Build search query parameters
    const searchParams = new URLSearchParams()

    if (searchForm.destination) {
      searchParams.set('search', searchForm.destination)
    }

    if (searchForm.checkIn) {
      searchParams.set('startDate', searchForm.checkIn)
      // For single date, set end date as same date (single day trip) or add a few days
      const checkInDate = new Date(searchForm.checkIn)
      const checkOutDate = new Date(checkInDate)
      checkOutDate.setDate(checkOutDate.getDate() + 3) // Default 3-day trip
      if (checkOutDate) {
        const endDateString = checkOutDate.toISOString().split('T')[0]
        if (endDateString) {
          searchParams.set('endDate', endDateString)
        }
      }
    }

    if (searchForm.groupSize) {
      // Convert group size to groupSize parameter
      switch (searchForm.groupSize) {
        case '1-2 people':
          searchParams.set('groupSize', '2')
          break
        case '3-5 people':
          searchParams.set('groupSize', '5')
          break
        case '6-10 people':
          searchParams.set('groupSize', '10')
          break
        case '10+ people':
          searchParams.set('groupSize', '15')
          break
      }
    }

    // Navigate to camps page with search parameters
    navigate(`/camps?${searchParams.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop)'
          }}
        ></div>
        <div className="relative container-max section-padding py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Discover India's Most
              <span className="text-secondary-400"> Amazing Camps</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-100">
              From Himalayan peaks to desert dunes, experience authentic camping adventures 
              across incredible destinations in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/camps"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Explore Camps</span>
              </Link>
              <Link
                to="/blog"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
              >
                <span>Travel Guides</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="bg-white dark:bg-gray-800 shadow-lg -mt-12 relative z-10">
        <div className="container-max section-padding py-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Adventure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="input-field pl-10"
                    value={searchForm.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={searchForm.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Size
                </label>
                <select
                  className="input-field"
                  value={searchForm.groupSize}
                  onChange={(e) => handleInputChange('groupSize', e.target.value)}
                >
                  <option value="">Select group size</option>
                  <option value="1-2 people">1-2 people</option>
                  <option value="3-5 people">3-5 people</option>
                  <option value="6-10 people">6-10 people</option>
                  <option value="10+ people">10+ people</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  className="btn-primary w-full flex items-center justify-center"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Search Camps</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Camps */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Featured Camping Experiences
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Handpicked adventures that showcase the best of India's natural beauty and cultural heritage.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading featured camps..." />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">Failed to load featured camps</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResponse?.success && featuredResponse.data?.map((camp) => (
                <Link
                  key={camp.id}
                  to={`/camps/${camp.id}`}
                  className="card hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={camp.images.find(img => img.isPrimary)?.url}
                      alt={camp.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{camp.rating.average}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {camp.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {camp.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{camp.location.name}, {camp.location.state}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{camp.duration.days}D/{camp.duration.nights}N</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{camp.groupSize.min}-{camp.groupSize.max} people</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{camp.pricing.basePrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">per person</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/camps"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All Camps</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CampIndia?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to providing safe, authentic, and unforgettable camping experiences across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Verified Organizers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All our camp organizers are verified and experienced professionals committed to your safety and enjoyment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Authentic Locations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover hidden gems and iconic destinations across India, from mountains to beaches to deserts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Community Focused
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join a community of adventure enthusiasts and create lasting friendships through shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
