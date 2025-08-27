import {
  BarChart3,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,

  Eye,
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,

  Download,
  RefreshCw
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatCurrency, formatDate } from '../../utils/format'

interface DashboardStats {
  totalCamps: number
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  pendingReviews: number
  averageRating: number
  conversionRate: number
}

interface RecentActivity {
  id: string
  type: 'booking' | 'review' | 'user' | 'camp'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data - in real app would come from API
  const stats: DashboardStats = {
    totalCamps: 45,
    totalUsers: 1247,
    totalBookings: 892,
    totalRevenue: 2847500,
    activeUsers: 156,
    pendingReviews: 23,
    averageRating: 4.6,
    conversionRate: 12.4
  }

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking',
      description: 'Arjun Sharma booked Triund Trek & Camping',
      timestamp: '2024-11-15T10:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      type: 'review',
      title: 'New Review',
      description: 'Sneha Patel left a 5-star review for Desert Safari',
      timestamp: '2024-11-15T09:15:00Z',
      status: 'success'
    },
    {
      id: '3',
      type: 'user',
      title: 'New User Registration',
      description: 'Vikram Singh joined as an organizer',
      timestamp: '2024-11-15T08:45:00Z',
      status: 'info'
    },
    {
      id: '4',
      type: 'camp',
      title: 'Camp Update Required',
      description: 'Ladakh Adventure needs weather info update',
      timestamp: '2024-11-15T07:20:00Z',
      status: 'warning'
    },
    {
      id: '5',
      type: 'booking',
      title: 'Booking Cancelled',
      description: 'Kavya Reddy cancelled Beach Camping booking',
      timestamp: '2024-11-14T18:30:00Z',
      status: 'error'
    }
  ]

  const topCamps = [
    { id: '1', name: 'Triund Trek & Camping', bookings: 156, revenue: 546000, rating: 4.8 },
    { id: '2', name: 'Jaisalmer Desert Safari', bookings: 134, revenue: 562800, rating: 4.7 },
    { id: '3', name: 'Gokarna Beach Camping', bookings: 98, revenue: 274400, rating: 4.5 },
    { id: '4', name: 'Lonavala Family Camping', bookings: 87, revenue: 217500, rating: 4.6 },
    { id: '5', name: 'Ladakh High Altitude', bookings: 45, revenue: 832500, rating: 4.9 }
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4" />
      case 'review': return <Star className="w-4 h-4" />
      case 'user': return <Users className="w-4 h-4" />
      case 'camp': return <MapPin className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here's what's happening with CampIndia.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="input-field text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                <span>Refresh</span>
              </button>

              {/* Export Button */}
              <button className="btn-primary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  {stats.totalBookings.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">+8.2%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">+15.3%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">+0.2</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Performing Camps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top Performing Camps
                </h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {topCamps.map((camp, index) => (
                  <div key={camp.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {camp.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{camp.bookings} bookings</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{camp.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(camp.revenue)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Add New Camp
                  </div>
                </button>

                <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Manage Users
                  </div>
                </button>

                <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Review Reports
                  </div>
                </button>

                <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    View Analytics
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h3>

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

              <button className="w-full mt-4 text-center text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All Activity
              </button>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                System Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-900 dark:text-white">API Status</span>
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-900 dark:text-white">Database</span>
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-900 dark:text-white">Payment Gateway</span>
                  </div>
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">Degraded</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-900 dark:text-white">Backup</span>
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-400">In Progress</span>
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Pending Tasks
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Review Pending
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {stats.pendingReviews} reviews need moderation
                    </p>
                  </div>
                  <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                    Review
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Camp Updates
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      3 camps need information updates
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Update
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      User Verification
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      12 organizers pending verification
                    </p>
                  </div>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
