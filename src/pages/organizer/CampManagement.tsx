import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,Eye,
  MapPin,Star} from 'lucide-react'
import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'
import CampForm from './CampForm'

interface Camp {
  id: string
  title: string
  location: string
  status: 'active' | 'inactive' | 'draft'
  bookings: number
  revenue: number
  rating: number
  reviews: number
  lastUpdated: string
  image: string
}

const CampManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - in real app would come from API
  const camps: Camp[] = [
    {
      id: '1',
      title: 'Triund Trek & Camping',
      location: 'Dharamshala, HP',
      status: 'active',
      bookings: 45,
      revenue: 135000,
      rating: 4.8,
      reviews: 32,
      lastUpdated: '2024-11-15T10:30:00Z',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Desert Safari Experience',
      location: 'Jaisalmer, RJ',
      status: 'active',
      bookings: 28,
      revenue: 98000,
      rating: 4.6,
      reviews: 19,
      lastUpdated: '2024-11-14T15:20:00Z',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Himalayan Base Camp',
      location: 'Manali, HP',
      status: 'draft',
      bookings: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      lastUpdated: '2024-11-13T09:45:00Z',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
    }
  ]

  const filteredCamps = camps.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         camp.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || camp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }



  return (
    <Routes>
      <Route index element={
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Camp Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your camps, pricing, and availability
              </p>
            </div>
            <Link
              to="/organizer/camps/new"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Camp</span>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search camps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCamps.map((camp) => (
              <div key={camp.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(camp.status)
                    )}>
                      {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {camp.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {camp.location}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {camp.bookings}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(camp.revenue)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Revenue</div>
                    </div>
                  </div>

                  {/* Rating */}
                  {camp.rating > 0 && (
                    <div className="flex items-center justify-center mb-4">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {camp.rating} ({camp.reviews} reviews)
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/organizer/camps/${camp.id}/edit`}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      to={`/camps/${camp.id}`}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCamps.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No camps found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first camp'}
              </p>
              <Link
                to="/organizer/camps/new"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Camp</span>
              </Link>
            </div>
          )}
        </div>
      } />
      <Route path="new" element={<CampForm />} />
      <Route path=":id/edit" element={<CampForm />} />
    </Routes>
  )
}

export default CampManagement
