import {
  Calendar,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Eye,
  MessageSquare,
  AlertTriangle,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useIsAuthenticated } from '../../hooks/useAuth'
import { formatCurrency, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface DashboardStats {
  totalCamps: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  pendingBookings: number
  activeBookings: number
  totalViews: number
  responseRate: number
}

interface RecentActivity {
  id: string
  type: 'booking' | 'review' | 'inquiry' | 'payment'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

const OrganizerOverview = () => {
  const { user } = useIsAuthenticated()

  // Mock data - in real app would come from API
  const stats: DashboardStats = {
    totalCamps: 8,
    totalBookings: 156,
    totalRevenue: 485000,
    averageRating: 4.7,
    pendingBookings: 5,
    activeBookings: 12,
    totalViews: 2847,
    responseRate: 95
  }

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      description: 'Arjun Sharma wants to book Triund Trek for Dec 15-17',
      timestamp: '2024-11-15T10:30:00Z',
      status: 'info'
    },
    {
      id: '2',
      type: 'review',
      title: 'New Review Received',
      description: 'Sneha Patel left a 5-star review for Desert Safari',
      timestamp: '2024-11-15T09:15:00Z',
      status: 'success'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: '₹15,000 payment for Ladakh Adventure booking',
      timestamp: '2024-11-15T08:45:00Z',
      status: 'success'
    },
    {
      id: '4',
      type: 'inquiry',
      title: 'Customer Inquiry',
      description: 'Question about equipment for Himalayan Trek',
      timestamp: '2024-11-15T07:20:00Z',
      status: 'warning'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4" />
      case 'review': return <Star className="w-4 h-4" />
      case 'payment': return <DollarSign className="w-4 h-4" />
      case 'inquiry': return <MessageSquare className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'warning': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'error': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      case 'info': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your camps today.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalBookings}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400">+8.2%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageRating}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Excellent</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Total Camps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Camps</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalCamps}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400">{stats.totalViews} views</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/organizer/camps/new"
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-200">
                Add New Camp
              </div>
            </Link>

            <Link
              to="/organizer/bookings"
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-200">
                Manage Bookings
              </div>
            </Link>

            <Link
              to="/organizer/analytics"
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-200">
                View Analytics
              </div>
            </Link>

            <Link
              to="/organizer/reviews"
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group"
            >
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-200">
                Manage Reviews
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Link
              to="/organizer/activity"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  getActivityColor(activity.status)
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerOverview
