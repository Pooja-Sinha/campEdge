import {
  TrendingUp,
  TrendingDown,
  DollarSign,Calendar,
  Star,
  Eye,
  MapPin,
  Download,
  RefreshCw,
  BarChart3,
  PieChart} from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  bookings: {
    current: number
    previous: number
    growth: number
  }
  visitors: {
    current: number
    previous: number
    growth: number
  }
  rating: {
    current: number
    previous: number
    growth: number
  }
}

interface CampPerformance {
  id: string
  name: string
  bookings: number
  revenue: number
  views: number
  conversionRate: number
  rating: number
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data - in real app would come from API
  const analyticsData: AnalyticsData = {
    revenue: {
      current: 485000,
      previous: 432000,
      growth: 12.3
    },
    bookings: {
      current: 156,
      previous: 142,
      growth: 9.9
    },
    visitors: {
      current: 2847,
      previous: 2654,
      growth: 7.3
    },
    rating: {
      current: 4.7,
      previous: 4.5,
      growth: 4.4
    }
  }

  const campPerformance: CampPerformance[] = [
    {
      id: '1',
      name: 'Triund Trek & Camping',
      bookings: 45,
      revenue: 135000,
      views: 1250,
      conversionRate: 3.6,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Desert Safari Experience',
      bookings: 28,
      revenue: 98000,
      views: 890,
      conversionRate: 3.1,
      rating: 4.6
    },
    {
      id: '3',
      name: 'Himalayan Base Camp',
      bookings: 35,
      revenue: 175000,
      views: 1100,
      conversionRate: 3.2,
      rating: 4.9
    },
    {
      id: '4',
      name: 'Coastal Camping Goa',
      bookings: 22,
      revenue: 66000,
      views: 720,
      conversionRate: 3.1,
      rating: 4.4
    },
    {
      id: '5',
      name: 'Wildlife Safari',
      bookings: 26,
      revenue: 78000,
      views: 650,
      conversionRate: 4.0,
      rating: 4.7
    }
  ]

  const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 18 },
    { month: 'Feb', revenue: 52000, bookings: 22 },
    { month: 'Mar', revenue: 48000, bookings: 19 },
    { month: 'Apr', revenue: 61000, bookings: 25 },
    { month: 'May', revenue: 58000, bookings: 24 },
    { month: 'Jun', revenue: 72000, bookings: 30 },
    { month: 'Jul', revenue: 85000, bookings: 35 },
    { month: 'Aug', revenue: 78000, bookings: 32 },
    { month: 'Sep', revenue: 69000, bookings: 28 },
    { month: 'Oct', revenue: 74000, bookings: 31 },
    { month: 'Nov', revenue: 82000, bookings: 34 },
    { month: 'Dec', revenue: 89000, bookings: 37 }
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export analytics data')
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics & Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </button>
          <button
            onClick={handleExport}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analyticsData.revenue.current)}
              </p>
              <div className={cn("flex items-center space-x-1 mt-2", getGrowthColor(analyticsData.revenue.growth))}>
                {getGrowthIcon(analyticsData.revenue.growth)}
                <span className="text-sm font-medium">
                  {analyticsData.revenue.growth > 0 ? '+' : ''}{analyticsData.revenue.growth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.bookings.current}
              </p>
              <div className={cn("flex items-center space-x-1 mt-2", getGrowthColor(analyticsData.bookings.growth))}>
                {getGrowthIcon(analyticsData.bookings.growth)}
                <span className="text-sm font-medium">
                  {analyticsData.bookings.growth > 0 ? '+' : ''}{analyticsData.bookings.growth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Visitors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.visitors.current.toLocaleString()}
              </p>
              <div className={cn("flex items-center space-x-1 mt-2", getGrowthColor(analyticsData.visitors.growth))}>
                {getGrowthIcon(analyticsData.visitors.growth)}
                <span className="text-sm font-medium">
                  {analyticsData.visitors.growth > 0 ? '+' : ''}{analyticsData.visitors.growth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.rating.current.toFixed(1)}
              </p>
              <div className={cn("flex items-center space-x-1 mt-2", getGrowthColor(analyticsData.rating.growth))}>
                {getGrowthIcon(analyticsData.rating.growth)}
                <span className="text-sm font-medium">
                  {analyticsData.rating.growth > 0 ? '+' : ''}{analyticsData.rating.growth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trend
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {monthlyData.slice(-6).map((data, _index) => (
              <div key={data.month} className="flex items-center space-x-3">
                <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                  {data.month}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%` }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(data.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Booking Distribution
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {campPerformance.slice(0, 4).map((camp, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
              const percentage = (camp.bookings / campPerformance.reduce((sum, c) => sum + c.bookings, 0)) * 100
              
              return (
                <div key={camp.id} className="flex items-center space-x-3">
                  <div className={cn("w-3 h-3 rounded-full", colors[index])} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {camp.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {camp.bookings} bookings
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Camp Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Camp Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Camp Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campPerformance.map((camp) => (
                <tr key={camp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {camp.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {camp.bookings}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(camp.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {camp.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {camp.conversionRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {camp.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
