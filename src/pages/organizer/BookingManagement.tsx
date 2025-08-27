import {
  Search,Calendar,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,Eye,
  MessageSquare,
  Download,
  MoreVertical
} from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface Booking {
  id: string
  campTitle: string
  customerName: string
  customerEmail: string
  customerPhone: string
  checkIn: string
  checkOut: string
  participants: number
  totalAmount: number
  paidAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed'
  bookingDate: string
  specialRequests?: string
}

const BookingManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all')
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  // Mock data - in real app would come from API
  const bookings: Booking[] = [
    {
      id: 'BK001',
      campTitle: 'Triund Trek & Camping',
      customerName: 'Arjun Sharma',
      customerEmail: 'arjun@example.com',
      customerPhone: '+91-98765-43210',
      checkIn: '2024-12-15T14:00:00Z',
      checkOut: '2024-12-17T11:00:00Z',
      participants: 4,
      totalAmount: 12000,
      paidAmount: 6000,
      status: 'pending',
      paymentStatus: 'partial',
      bookingDate: '2024-11-15T10:30:00Z',
      specialRequests: 'Vegetarian meals for all participants'
    },
    {
      id: 'BK002',
      campTitle: 'Desert Safari Experience',
      customerName: 'Sneha Patel',
      customerEmail: 'sneha@example.com',
      customerPhone: '+91-87654-32109',
      checkIn: '2024-12-20T16:00:00Z',
      checkOut: '2024-12-22T10:00:00Z',
      participants: 2,
      totalAmount: 8000,
      paidAmount: 8000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-11-14T15:20:00Z'
    },
    {
      id: 'BK003',
      campTitle: 'Himalayan Base Camp',
      customerName: 'Vikram Singh',
      customerEmail: 'vikram@example.com',
      customerPhone: '+91-76543-21098',
      checkIn: '2024-11-25T12:00:00Z',
      checkOut: '2024-11-28T14:00:00Z',
      participants: 6,
      totalAmount: 18000,
      paidAmount: 18000,
      status: 'completed',
      paymentStatus: 'paid',
      bookingDate: '2024-11-01T09:45:00Z'
    }
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.campTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = status === 'all' || booking.status === status
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'no-show': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 dark:text-green-400'
      case 'partial': return 'text-yellow-600 dark:text-yellow-400'
      case 'pending': return 'text-orange-600 dark:text-orange-400'
      case 'failed': return 'text-red-600 dark:text-red-400'
      case 'refunded': return 'text-blue-600 dark:text-blue-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const handleApproveBooking = (bookingId: string) => {
    // TODO: Implement booking approval
    console.log('Approve booking:', bookingId)
  }

  const handleDeclineBooking = (bookingId: string) => {
    // TODO: Implement booking decline
    console.log('Decline booking:', bookingId)
  }

  const handleBulkAction = (action: string) => {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action, 'for bookings:', selectedBookings)
  }

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  const selectAllBookings = () => {
    setSelectedBookings(
      selectedBookings.length === filteredBookings.length 
        ? [] 
        : filteredBookings.map(b => b.id)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Booking Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer bookings and reservations
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(bookings.reduce((sum, b) => sum + b.paidAmount, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Guests</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {bookings.reduce((sum, b) => sum + b.participants, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search ands */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBookings.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-400">
                {selectedBookings.length} booking(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Approve All
                </button>
                <button
                  onClick={() => handleBulkAction('decline')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Decline All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={selectAllBookings}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => toggleBookingSelection(booking.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.campTitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.participants} guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <div className={cn("text-sm", getPaymentStatusColor(booking.paymentStatus))}>
                        {booking.paymentStatus} ({formatCurrency(booking.paidAmount)})
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(booking.status)
                    )}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveBooking(booking.id)}
                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeclineBooking(booking.id)}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Decline"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="Message Customer">
                        <MessageSquare className="w-4 h-4" />
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
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search criteria' : 'Bookings will appear here when customers make reservations'}
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingManagement
