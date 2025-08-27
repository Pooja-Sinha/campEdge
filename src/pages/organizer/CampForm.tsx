import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,Plus,
  Trash2,CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface CampFormData {
  // Basic Information
  title: string
  description: string
  shortDescription: string
  category: string
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert'
  
  // Location
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number }
    nearbyLandmarks: string[]
  }
  
  // Capacity & Duration
  maxParticipants: number
  minParticipants: number
  duration: {
    days: number
    nights: number
  }
  
  // Pricing
  pricing: {
    basePrice: number
    currency: string
    priceIncludes: string[]
    priceExcludes: string[]
  }
  
  // Amenities & Services
  amenities: string[]
  activities: string[]
  services: string[]
  equipment: string[]
  
  // Media
  images: string[]
  videos: string[]
  
  // Policies
  policies: {
    cancellation: string
    refund: string
    ageRestriction: string
    healthRequirements: string
  }
  
  // Contact & Safety
  emergencyContact: {
    name: string
    phone: string
    email: string
  }
  safetyMeasures: string[]
  
  // Status
  status: 'draft' | 'active' | 'inactive'
}

const CampForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CampFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    difficulty: 'easy',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      coordinates: { lat: 0, lng: 0 },
      nearbyLandmarks: []
    },
    maxParticipants: 10,
    minParticipants: 2,
    duration: { days: 2, nights: 1 },
    pricing: {
      basePrice: 0,
      currency: 'INR',
      priceIncludes: [],
      priceExcludes: []
    },
    amenities: [],
    activities: [],
    services: [],
    equipment: [],
    images: [],
    videos: [],
    policies: {
      cancellation: '',
      refund: '',
      ageRestriction: '',
      healthRequirements: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      email: ''
    },
    safetyMeasures: [],
    status: 'draft'
  })

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Camp details and description' },
    { id: 2, title: 'Location', description: 'Location and accessibility' },
    { id: 3, title: 'Capacity & Duration', description: 'Participants and timing' },
    { id: 4, title: 'Pricing', description: 'Pricing and inclusions' },
    { id: 5, title: 'Amenities', description: 'Facilities and activities' },
    { id: 6, title: 'Media', description: 'Photos and videos' },
    { id: 7, title: 'Policies', description: 'Terms and conditions' },
    { id: 8, title: 'Review', description: 'Final review and publish' }
  ]

  const categories = [
    'Adventure Camping', 'Mountain Trekking', 'Desert Safari', 'Beach Camping',
    'Wildlife Safari', 'Cultural Tours', 'Photography Tours', 'Spiritual Retreats',
    'Corporate Retreats', 'Family Camping', 'Solo Travel', 'Group Adventures'
  ]

  const amenitiesList = [
    'Tents', 'Sleeping Bags', 'Campfire', 'BBQ Grill', 'Toilets', 'Shower',
    'Electricity', 'WiFi', 'Parking', 'First Aid', 'Security', 'Food Service',
    'Water Supply', 'Waste Management', 'Lighting', 'Seating Area'
  ]

  const activitiesList = [
    'Trekking', 'Rock Climbing', 'River Rafting', 'Paragliding', 'Cycling',
    'Photography', 'Bird Watching', 'gazing', 'Bonfire', 'Music',
    'Games', 'Yoga', 'Meditation', 'Fishing', 'Swimming', 'Hiking'
  ]

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof CampFormData] as object || {}),
        [field]: value
      }
    }))
  }

  const addToArray = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof CampFormData] as string[]), value.trim()]
      }))
    }
  }

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof CampFormData] as string[]).filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Submitting camp data:', formData)
    // TODO: Implement API call to save camp
    navigate('/organizer/camps')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Camp Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Enter camp title"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {['easy', 'moderate', 'challenging', 'expert'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateFormData('difficulty', level)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-colors",
                      formData.difficulty === level
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    )}
                  >
                    <div className="font-medium capitalize">{level}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => updateFormData('shortDescription', e.target.value)}
                placeholder="Brief description (max 200 characters)"
                maxLength={200}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.shortDescription.length}/200 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Detailed description of your camp experience"
                rows={6}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Address *
              </label>
              <textarea
                value={formData.location.address}
                onChange={(e) => updateNestedFormData('location', 'address', e.target.value)}
                placeholder="Enter complete address"
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => updateNestedFormData('location', 'city', e.target.value)}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => updateNestedFormData('location', 'state', e.target.value)}
                  placeholder="State"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  value={formData.location.country}
                  onChange={(e) => updateNestedFormData('location', 'country', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Bhutan">Bhutan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nearby Landmarks
              </label>
              <div className="space-y-2">
                {formData.location.nearbyLandmarks.map((landmark, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={landmark}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromArray('location.nearbyLandmarks', index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add nearby landmark"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value
                        if (value.trim()) {
                          updateNestedFormData('location', 'nearbyLandmarks', [...formData.location.nearbyLandmarks, value.trim()])
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Participants *
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => updateFormData('maxParticipants', parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Participants *
                </label>
                <input
                  type="number"
                  value={formData.minParticipants}
                  onChange={(e) => updateFormData('minParticipants', parseInt(e.target.value))}
                  min="1"
                  max={formData.maxParticipants}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  value={formData.duration.days}
                  onChange={(e) => updateNestedFormData('duration', 'days', parseInt(e.target.value))}
                  min="1"
                  max="30"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nights
                </label>
                <input
                  type="number"
                  value={formData.duration.nights}
                  onChange={(e) => updateNestedFormData('duration', 'nights', parseInt(e.target.value))}
                  min="0"
                  max="29"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Price (per person) *
              </label>
              <div className="flex">
                <select
                  value={formData.pricing.currency}
                  onChange={(e) => updateNestedFormData('pricing', 'currency', e.target.value)}
                  className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="INR">₹</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
                <input
                  type="number"
                  value={formData.pricing.basePrice}
                  onChange={(e) => updateNestedFormData('pricing', 'basePrice', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Includes
              </label>
              <div className="space-y-2">
                {formData.pricing.priceIncludes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <input
                      type="text"
                      value={item}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromArray('pricing.priceIncludes', index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="What's included in the price?"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value
                        if (value.trim()) {
                          updateNestedFormData('pricing', 'priceIncludes', [...formData.pricing.priceIncludes, value.trim()])
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Excludes
              </label>
              <div className="space-y-2">
                {formData.pricing.priceExcludes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <input
                      type="text"
                      value={item}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromArray('pricing.priceExcludes', index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="What's not included?"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value
                        if (value.trim()) {
                          updateNestedFormData('pricing', 'priceExcludes', [...formData.pricing.priceExcludes, value.trim()])
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData('amenities', [...formData.amenities, amenity])
                        } else {
                          updateFormData('amenities', formData.amenities.filter(a => a !== amenity))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activitiesList.map(activity => (
                  <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activities.includes(activity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData('activities', [...formData.activities, activity])
                        } else {
                          updateFormData('activities', formData.activities.filter(a => a !== activity))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Equipment Provided
              </label>
              <div className="space-y-2">
                {formData.equipment.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromArray('equipment', index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add equipment item"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value
                        if (value.trim()) {
                          addToArray('equipment', value)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Camp Images
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop images here, or click to browse
                </p>
                <button
                  type="button"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Choose Images
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload high-quality images (JPG, PNG). First image will be the cover photo.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Videos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Upload promotional videos
                </p>
                <button
                  type="button"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Choose Videos
                </button>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cancellation Policy *
              </label>
              <textarea
                value={formData.policies.cancellation}
                onChange={(e) => updateNestedFormData('policies', 'cancellation', e.target.value)}
                placeholder="Describe your cancellation policy"
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refund Policy *
              </label>
              <textarea
                value={formData.policies.refund}
                onChange={(e) => updateNestedFormData('policies', 'refund', e.target.value)}
                placeholder="Describe your refund policy"
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Age Restrictions
              </label>
              <input
                type="text"
                value={formData.policies.ageRestriction}
                onChange={(e) => updateNestedFormData('policies', 'ageRestriction', e.target.value)}
                placeholder="e.g., Minimum age 18, Children under 12 not allowed"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Health Requirements
              </label>
              <textarea
                value={formData.policies.healthRequirements}
                onChange={(e) => updateNestedFormData('policies', 'healthRequirements', e.target.value)}
                placeholder="Any health or fitness requirements"
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => updateNestedFormData('emergencyContact', 'name', e.target.value)}
                  placeholder="Contact name"
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => updateNestedFormData('emergencyContact', 'phone', e.target.value)}
                  placeholder="Phone number"
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="email"
                  value={formData.emergencyContact.email}
                  onChange={(e) => updateNestedFormData('emergencyContact', 'email', e.target.value)}
                  placeholder="Email address"
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-400 mb-4">
                Review Your Camp Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Basic Information</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Difficulty:</strong> {formData.difficulty}</p>
                    <p><strong>Duration:</strong> {formData.duration.days} days, {formData.duration.nights} nights</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Capacity & Pricing</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Participants:</strong> {formData.minParticipants} - {formData.maxParticipants}</p>
                    <p><strong>Price:</strong> {formData.pricing.currency} {formData.pricing.basePrice}</p>
                    <p><strong>Location:</strong> {formData.location.city}, {formData.location.state}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publication Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'draft', label: 'Save as Draft', description: 'Not visible to customers' },
                  { value: 'active', label: 'Publish Now', description: 'Visible and bookable' },
                  { value: 'inactive', label: 'Publish Later', description: 'Visible but not bookable' }
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateFormData('status', status.value)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-colors",
                      formData.status === status.value
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    )}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{status.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{status.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return <div>Step content for step {currentStep}</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/organizer/camps')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Camp' : 'Create New Camp'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </p>
          </div>
        </div>
        <button
          onClick={() => updateFormData('status', 'draft')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Draft</span>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep >= step.id
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              )}>
                {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2",
                  currentStep > step.id ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {steps[currentStep - 1]?.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
            currentStep === 1
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentStep === steps.length ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isEditing ? 'Update Camp' : 'Publish Camp'}</span>
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default CampForm
