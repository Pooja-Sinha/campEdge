import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  MapPin,
  Building,
  Shield,
  Star,
  Users,
  FileText,
  Rocket
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface OnboardingData {
  step: number
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    bio: string
  }
  business: {
    companyName: string
    businessType: string
    description: string
    website: string
    establishedYear: number
  }
  location: {
    address: string
    city: string
    state: string
    country: string
  }
  verification: {
    businessRegistration: File | null
    taxDocument: File | null
    insuranceDocument: File | null
  }
  preferences: {
    categories: string[]
    targetAudience: string[]
    specializations: string[]
  }
}

const OrganizerOnboarding = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step: 1,
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: ''
    },
    business: {
      companyName: '',
      businessType: '',
      description: '',
      website: '',
      establishedYear: new Date().getFullYear()
    },
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India'
    },
    verification: {
      businessRegistration: null,
      taxDocument: null,
      insuranceDocument: null
    },
    preferences: {
      categories: [],
      targetAudience: [],
      specializations: []
    }
  })

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: Users,
      fields: ['firstName', 'lastName', 'email', 'phone', 'bio']
    },
    {
      id: 2,
      title: 'Business Details',
      description: 'Your business information',
      icon: Building,
      fields: ['companyName', 'businessType', 'description']
    },
    {
      id: 3,
      title: 'Location & Contact',
      description: 'Where are you located?',
      icon: MapPin,
      fields: ['address', 'city', 'state']
    },
    {
      id: 4,
      title: 'Verification Documents',
      description: 'Upload required documents',
      icon: Shield,
      fields: ['businessRegistration', 'taxDocument']
    },
    {
      id: 5,
      title: 'Preferences & Specialization',
      description: 'What do you offer?',
      icon: Star,
      fields: ['categories', 'specializations']
    },
    {
      id: 6,
      title: 'Review & Complete',
      description: 'Review your information',
      icon: CheckCircle,
      fields: []
    }
  ]

  const businessTypes = [
    'Adventure Tourism Company',
    'Travel Agency',
    'Tour Operator',
    'Individual Guide',
    'Outdoor Activity Provider',
    'Camping Equipment Rental',
    'Transportation Service'
  ]

  const categories = [
    'Adventure Camping', 'Mountain Trekking', 'Desert Safari', 'Beach Camping',
    'Wildlife Safari', 'Cultural Tours', 'Photography Tours', 'Spiritual Retreats',
    'Corporate Retreats', 'Family Camping', 'Solo Travel', 'Group Adventures'
  ]

  const specializations = [
    'Rock Climbing', 'River Rafting', 'Paragliding', 'Scuba Diving',
    'Wildlife Photography', 'Bird Watching', 'Stargazing', 'Yoga Retreats',
    'Meditation', 'Cultural Immersion', 'Local Cuisine', 'Eco-Tourism'
  ]

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' ? prev[section] : {}),
        [field]: value
      }
    }))
  }

  const toggleArrayItem = (section: keyof OnboardingData, field: string, item: string) => {
    setOnboardingData(prev => {
      const currentArray = (prev[section] as any)[field] as string[]
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]
      
      return {
        ...prev,
        [section]: {
          ...(typeof prev[section] === 'object' ? prev[section] : {}),
          [field]: newArray
        }
      }
    })
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

  const completeOnboarding = () => {
    console.log('Completing onboarding with data:', onboardingData)
    // TODO: Submit onboarding data to API
    navigate('/organizer')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to CampEdge!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Let's start by getting to know you better
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={onboardingData.personal.firstName}
                  onChange={(e) => updateData('personal', 'firstName', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={onboardingData.personal.lastName}
                  onChange={(e) => updateData('personal', 'lastName', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={onboardingData.personal.email}
                  onChange={(e) => updateData('personal', 'email', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={onboardingData.personal.phone}
                  onChange={(e) => updateData('personal', 'phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio / About You
              </label>
              <textarea
                value={onboardingData.personal.bio}
                onChange={(e) => updateData('personal', 'bio', e.target.value)}
                rows={4}
                placeholder="Tell us about your experience in adventure tourism..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Business Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your business or organization
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company/Business Name *
              </label>
              <input
                type="text"
                value={onboardingData.business.companyName}
                onChange={(e) => updateData('business', 'companyName', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Type *
              </label>
              <select
                value={onboardingData.business.businessType}
                onChange={(e) => updateData('business', 'businessType', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={onboardingData.business.website}
                  onChange={(e) => updateData('business', 'website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  value={onboardingData.business.establishedYear}
                  onChange={(e) => updateData('business', 'establishedYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Description *
              </label>
              <textarea
                value={onboardingData.business.description}
                onChange={(e) => updateData('business', 'description', e.target.value)}
                rows={4}
                placeholder="Describe your business, services, and what makes you unique..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Location & Contact
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Where is your business located?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Address *
              </label>
              <textarea
                value={onboardingData.location.address}
                onChange={(e) => updateData('location', 'address', e.target.value)}
                rows={3}
                placeholder="Enter your complete business address"
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
                  value={onboardingData.location.city}
                  onChange={(e) => updateData('location', 'city', e.target.value)}
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
                  value={onboardingData.location.state}
                  onChange={(e) => updateData('location', 'state', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  value={onboardingData.location.country}
                  onChange={(e) => updateData('location', 'country', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verification Documents
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload required documents for verification
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Business Registration Certificate *
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Upload your business registration or incorporation certificate
                  </div>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Choose File
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Tax Registration Document *
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Upload GST certificate or tax registration document
                  </div>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Choose File
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Insurance Certificate (Optional)
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Upload liability insurance certificate if available
                  </div>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-400">
                    Document Requirements
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    • Documents should be clear and readable<br/>
                    • Accepted formats: PDF, JPG, PNG<br/>
                    • Maximum file size: 5MB per document<br/>
                    • Documents will be reviewed within 2-3 business days
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Star className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Specializations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                What types of experiences do you offer?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Categories (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onboardingData.preferences.categories.includes(category)}
                      onChange={() => toggleArrayItem('preferences', 'categories', category)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Specializations (Select your expertise)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specializations.map(spec => (
                  <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onboardingData.preferences.specializations.includes(spec)}
                      onChange={() => toggleArrayItem('preferences', 'specializations', spec)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Rocket className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Launch!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review your information and complete your registration
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Registration Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Personal</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>{onboardingData.personal.firstName} {onboardingData.personal.lastName}</p>
                    <p>{onboardingData.personal.email}</p>
                    <p>{onboardingData.personal.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Business</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>{onboardingData.business.companyName}</p>
                    <p>{onboardingData.business.businessType}</p>
                    <p>{onboardingData.location.city}, {onboardingData.location.state}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.preferences.categories.map(category => (
                    <span key={category} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-900 dark:text-green-400">
                    What happens next?
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    • Your account will be created immediately<br/>
                    • Document verification will take 2-3 business days<br/>
                    • You can start creating camps right away<br/>
                    • Our team will contact you within 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  currentStep >= step.id
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                )}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors",
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
              onClick={completeOnboarding}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Rocket className="w-4 h-4" />
              <span>Complete Registration</span>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganizerOnboarding
