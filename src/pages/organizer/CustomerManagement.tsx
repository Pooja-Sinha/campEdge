import {
  Users,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Eye,
  MoreVertical,
  Download,
  Tag,
  TrendingUp,
  Heart
} from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  totalBookings: number
  totalSpent: number
  averageRating: number
  lastBooking: string
  joinDate: string
  status: 'active' | 'inactive' | 'vip'
  segment: 'new' | 'regular' | 'vip' | 'at-risk'
  preferences: string[]
  notes?: string
}

interface CustomerSegment {
  id: string
  name: string
  description: string
  count: number
  color: string
}

const CustomerManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'new' | 'regular' | 'vip' | 'at-risk'>('all')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [showSegments, setShowSegments] = useState(false)

  // Mock data
  const customers: Customer[] = [
    {
      id: 'C001',
      name: 'Arjun Sharma',
      email: 'arjun@example.com',
      phone: '+91-98765-43210',
      avatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=059669&color=fff',
      totalBookings: 8,
      totalSpent: 45000,
      averageRating: 4.8,
      lastBooking: '2024-11-15T10:30:00Z',
      joinDate: '2023-06-15T10:30:00Z',
      status: 'active',
      segment: 'vip',
      preferences: ['Adventure', 'Trekking', 'Photography'],
      notes: 'Prefers vegetarian meals. Excellent photographer.'
    },
    {
      id: 'C002',
      name: 'Sneha Patel',
      email: 'sneha@example.com',
      phone: '+91-87654-32109',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=059669&color=fff',
      totalBookings: 3,
      totalSpent: 18000,
      averageRating: 4.6,
      lastBooking: '2024-11-10T15:20:00Z',
      joinDate: '2024-03-20T10:30:00Z',
      status: 'active',
      segment: 'regular',
      preferences: ['Desert', 'Camping', 'Stargazing']
    },
    {
      id: 'C003',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91-76543-21098',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=059669&color=fff',
      totalBookings: 1,
      totalSpent: 6000,
      averageRating: 4.9,
      lastBooking: '2024-10-25T09:45:00Z',
      joinDate: '2024-10-20T10:30:00Z',
      status: 'active',
      segment: 'new',
      preferences: ['Mountains', 'Hiking']
    }
  ]

  const segments: CustomerSegment[] = [
    {
      id: 'new',
      name: 'New Customers',
      description: 'Customers with 1-2 bookings',
      count: 45,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'regular',
      name: 'Regular Customers',
      description: 'Customers with 3-7 bookings',
      count: 28,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'vip',
      name: 'VIP Customers',
      description: 'Customers with 8+ bookings',
      count: 12,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: 'at-risk',
      name: 'At Risk',
      description: 'No bookings in last 6 months',
      count: 8,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery)
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter
    return matchesSearch && matchesSegment
  })



  const getSegmentColor = (segment: string) => {
    const segmentData = segments.find(s => s.id === segment)
    return segmentData?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const selectAllCustomers = () => {
    setSelectedCustomers(
      selectedCustomers.length === filteredCustomers.length 
        ? [] 
        : filteredCustomers.map(c => c.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for customers:', selectedCustomers)
  }

  const sendMessage = (customerId: string) => {
    console.log('Send message to customer:', customerId)
  }

  const callCustomer = (customerId: string) => {
    console.log('Call customer:', customerId)
  }

  const emailCustomer = (customerId: string) => {
    console.log('Email customer:', customerId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer relationships and communications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSegments(!showSegments)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>Segments</span>
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Customer Segments */}
      {showSegments && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {segments.map((segment) => (
            <div key={segment.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {segment.name}
                </h3>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", segment.color)}>
                  {segment.count}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Customer Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Repeat Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {((customers.filter(c => c.totalBookings > 1).length / customers.length) * 100).toFixed(1)}%
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(customers.reduce((sum, c) => sum + c.averageRating, 0) / customers.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Segments</option>
              <option value="new">New</option>
              <option value="regular">Regular</option>
              <option value="vip">VIP</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-400">
                {selectedCustomers.length} customer(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('message')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Send Message
                </button>
                <button
                  onClick={() => handleBulkAction('segment')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Change Segment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={selectAllCustomers}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomerSelection(customer.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {customer.totalBookings}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {customer.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getSegmentColor(customer.segment)
                    )}>
                      {customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatDate(customer.lastBooking)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => sendMessage(customer.id)}
                        className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => callCustomer(customer.id)}
                        className="p-1 text-green-600 hover:text-green-700 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => emailCustomer(customer.id)}
                        className="p-1 text-purple-600 hover:text-purple-700 transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="More Options">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No customers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search criteria' : 'Customer data will appear here as bookings are made'}
          </p>
        </div>
      )}
    </div>
  )
}

export default CustomerManagement
