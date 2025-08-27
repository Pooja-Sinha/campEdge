import {
  User,
  Building,
  Phone,
  Mail,
  Camera,
  Upload,
  Save,
  Edit,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Calendar,
  Shield
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'

interface OrganizerProfileData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string
    bio: string
  }
  business: {
    companyName: string
    businessType: string
    registrationNumber: string
    taxId: string
    website: string
    description: string
    logo: string
    establishedYear: number
  }
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  social: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }
  verification: {
    emailVerified: boolean
    phoneVerified: boolean
    businessVerified: boolean
    documentsUploaded: boolean
  }
  settings: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    privacy: {
      showPhone: boolean
      showEmail: boolean
      showSocial: boolean
    }
    business: {
      autoApproveBookings: boolean
      instantBooking: boolean
      requireDeposit: boolean
      depositPercentage: number
    }
  }
}

const OrganizerProfile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'verification' | 'settings'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<OrganizerProfileData>({
    personal: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'organizer@campedge.com',
      phone: '+91-98765-43210',
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=059669&color=fff',
      bio: 'Experienced adventure guide with 10+ years in outdoor activities and camping.'
    },
    business: {
      companyName: 'Adventure Trails India',
      businessType: 'Adventure Tourism',
      registrationNumber: 'ATI2024001',
      taxId: 'GSTIN123456789',
      website: 'https://adventuretrails.in',
      description: 'Leading adventure tourism company specializing in trekking, camping, and outdoor experiences across India.',
      logo: '',
      establishedYear: 2015
    },
    address: {
      street: '123 Mountain View Road',
      city: 'Dharamshala',
      state: 'Himachal Pradesh',
      country: 'India',
      zipCode: '176215'
    },
    social: {
      facebook: 'https://facebook.com/adventuretrails',
      instagram: 'https://instagram.com/adventuretrails',
      twitter: 'https://twitter.com/adventuretrails',
      youtube: 'https://youtube.com/adventuretrails'
    },
    verification: {
      emailVerified: true,
      phoneVerified: true,
      businessVerified: false,
      documentsUploaded: true
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      privacy: {
        showPhone: true,
        showEmail: false,
        showSocial: true
      },
      business: {
        autoApproveBookings: false,
        instantBooking: true,
        requireDeposit: true,
        depositPercentage: 25
      }
    }
  })

  const updateProfileData = (section: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof OrganizerProfileData],
        [field]: value
      }
    }))
  }

  const updateNestedData = (section: string, subsection: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof OrganizerProfileData],
        [subsection]: {
          ...(prev[section as keyof OrganizerProfileData] as any)[subsection],
          [field]: value
        }
      }
    }))
  }

  const handleSave = () => {
    console.log('Saving profile data:', profileData)
    setIsEditing(false)
    // TODO: Implement API call to save profile
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={profileData.personal.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profileData.personal.firstName}
                onChange={(e) => updateProfileData('personal', 'firstName', e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profileData.personal.lastName}
                onChange={(e) => updateProfileData('personal', 'lastName', e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profileData.personal.email}
                  onChange={(e) => updateProfileData('personal', 'email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
                {profileData.verification.emailVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={profileData.personal.phone}
                  onChange={(e) => updateProfileData('personal', 'phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
                {profileData.verification.phoneVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={profileData.personal.bio}
            onChange={(e) => updateProfileData('personal', 'bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
          />
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={profileData.address.street}
              onChange={(e) => updateProfileData('address', 'street', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.address.city}
              onChange={(e) => updateProfileData('address', 'city', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State
            </label>
            <input
              type="text"
              value={profileData.address.state}
              onChange={(e) => updateProfileData('address', 'state', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <select
              value={profileData.address.country}
              onChange={(e) => updateProfileData('address', 'country', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            >
              <option value="India">India</option>
              <option value="Nepal">Nepal</option>
              <option value="Bhutan">Bhutan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={profileData.address.zipCode}
              onChange={(e) => updateProfileData('address', 'zipCode', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBusinessTab = () => (
    <div className="space-y-6">
      {/* Business Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Business Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={profileData.business.companyName}
              onChange={(e) => updateProfileData('business', 'companyName', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Type
            </label>
            <select
              value={profileData.business.businessType}
              onChange={(e) => updateProfileData('business', 'businessType', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            >
              <option value="Adventure Tourism">Adventure Tourism</option>
              <option value="Travel Agency">Travel Agency</option>
              <option value="Tour Operator">Tour Operator</option>
              <option value="Individual Guide">Individual Guide</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={profileData.business.registrationNumber}
              onChange={(e) => updateProfileData('business', 'registrationNumber', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax ID / GST Number
            </label>
            <input
              type="text"
              value={profileData.business.taxId}
              onChange={(e) => updateProfileData('business', 'taxId', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profileData.business.website}
              onChange={(e) => updateProfileData('business', 'website', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Established Year
            </label>
            <input
              type="number"
              value={profileData.business.establishedYear}
              onChange={(e) => updateProfileData('business', 'establishedYear', parseInt(e.target.value))}
              disabled={!isEditing}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Description
          </label>
          <textarea
            value={profileData.business.description}
            onChange={(e) => updateProfileData('business', 'description', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Social Media Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={profileData.social.facebook}
              onChange={(e) => updateProfileData('social', 'facebook', e.target.value)}
              disabled={!isEditing}
              placeholder="https://facebook.com/yourpage"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={profileData.social.instagram}
              onChange={(e) => updateProfileData('social', 'instagram', e.target.value)}
              disabled={!isEditing}
              placeholder="https://instagram.com/yourpage"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={profileData.social.twitter}
              onChange={(e) => updateProfileData('social', 'twitter', e.target.value)}
              disabled={!isEditing}
              placeholder="https://twitter.com/yourpage"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              YouTube
            </label>
            <input
              type="url"
              value={profileData.social.youtube}
              onChange={(e) => updateProfileData('social', 'youtube', e.target.value)}
              disabled={!isEditing}
              placeholder="https://youtube.com/yourchannel"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderVerificationTab = () => (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Verification Status
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Email Verification</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Verify your email address</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {profileData.verification.emailVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                profileData.verification.emailVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              )}>
                {profileData.verification.emailVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Phone Verification</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Verify your phone number</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {profileData.verification.phoneVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                profileData.verification.phoneVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              )}>
                {profileData.verification.phoneVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Business Verification</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Verify your business registration</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {profileData.verification.businessVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                profileData.verification.businessVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              )}>
                {profileData.verification.businessVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Required Documents
        </h3>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Upload Business Registration Certificate
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Choose File
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Upload Tax Registration / GST Certificate
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Choose File
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Upload Tourism License (if applicable)
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.notifications.email}
                onChange={(e) => updateNestedData('settings', 'notifications', 'email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.notifications.sms}
                onChange={(e) => updateNestedData('settings', 'notifications', 'sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.notifications.push}
                onChange={(e) => updateNestedData('settings', 'notifications', 'push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Business Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Auto-approve Bookings</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Automatically approve new bookings</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.business.autoApproveBookings}
                onChange={(e) => updateNestedData('settings', 'business', 'autoApproveBookings', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Instant Booking</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Allow customers to book instantly</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.business.instantBooking}
                onChange={(e) => updateNestedData('settings', 'business', 'instantBooking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Require Deposit</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Require advance deposit for bookings</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.business.requireDeposit}
                onChange={(e) => updateNestedData('settings', 'business', 'requireDeposit', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {profileData.settings.business.requireDeposit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deposit Percentage
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={profileData.settings.business.depositPercentage}
                  onChange={(e) => updateNestedData('settings', 'business', 'depositPercentage', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {profileData.settings.business.depositPercentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Organizer Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your profile and business information
          </p>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profile Completion</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">85%</p>
            </div>
            <User className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verification Status</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Pending</p>
            </div>
            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2015</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</p>
            </div>
            <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'business', label: 'Business', icon: Building },
            { id: 'verification', label: 'Verification', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'business' && renderBusinessTab()}
      {activeTab === 'verification' && renderVerificationTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  )
}

export default OrganizerProfile
