import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Download,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Percent,
  Clock,
  Search
} from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface Transaction {
  id: string
  type: 'booking' | 'refund' | 'payout' | 'fee'
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  bookingId?: string
  customerName?: string
}

interface PricingRule {
  id: string
  campId: string
  campName: string
  basePrice: number
  seasonalMultiplier: number
  weekendMultiplier: number
  groupDiscounts: { minSize: number; discount: number }[]
  advanceBookingDiscount: { days: number; discount: number }[]
  isActive: boolean
}

interface PromoCode {
  id: string
  code: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  minAmount?: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  usageLimit: number
  usedCount: number
  isActive: boolean
}

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'pricing' | 'promos'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  // Mock data
  const financialOverview = {
    totalRevenue: 485000,
    pendingPayouts: 125000,
    monthlyRevenue: 82000,
    averageBookingValue: 3100,
    totalTransactions: 156,
    refundRate: 2.3
  }

  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'booking',
      description: 'Booking payment received',
      amount: 12000,
      status: 'completed',
      date: '2024-11-15T10:30:00Z',
      bookingId: 'BK001',
      customerName: 'Arjun Sharma'
    },
    {
      id: 'TXN002',
      type: 'payout',
      description: 'Monthly payout',
      amount: -45000,
      status: 'completed',
      date: '2024-11-14T15:20:00Z'
    },
    {
      id: 'TXN003',
      type: 'refund',
      description: 'Booking cancellation refund',
      amount: -8000,
      status: 'pending',
      date: '2024-11-13T09:45:00Z',
      bookingId: 'BK025',
      customerName: 'Priya Singh'
    }
  ]

  const pricingRules: PricingRule[] = [
    {
      id: 'PR001',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      basePrice: 3000,
      seasonalMultiplier: 1.2,
      weekendMultiplier: 1.15,
      groupDiscounts: [
        { minSize: 4, discount: 10 },
        { minSize: 8, discount: 15 }
      ],
      advanceBookingDiscount: [
        { days: 30, discount: 5 },
        { days: 60, discount: 10 }
      ],
      isActive: true
    }
  ]

  const promoCodes: PromoCode[] = [
    {
      id: 'PC001',
      code: 'WINTER2024',
      description: 'Winter season discount',
      type: 'percentage',
      value: 15,
      minAmount: 5000,
      maxDiscount: 2000,
      validFrom: '2024-12-01T00:00:00Z',
      validTo: '2024-02-28T23:59:59Z',
      usageLimit: 100,
      usedCount: 23,
      isActive: true
    }
  ]

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'booking': return 'text-green-600 dark:text-green-400'
      case 'payout': return 'text-blue-600 dark:text-blue-400'
      case 'refund': return 'text-red-600 dark:text-red-400'
      case 'fee': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(financialOverview.totalRevenue)}
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Payouts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(financialOverview.pendingPayouts)}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Next: Dec 1</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(financialOverview.averageBookingValue)}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400">+8.2%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-200">
              Create Promo Code
            </div>
          </button>

          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Edit className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-medium text-green-700 dark:text-green-200">
              Update Pricing
            </div>
          </button>

          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-200">
              Download Report
            </div>
          </button>

          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-medium text-orange-700 dark:text-orange-200">
              Payout Schedule
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.id}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("text-sm font-medium", getTransactionColor(transaction.type))}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(transaction.status)
                    )}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {transaction.customerName || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pricing Rules
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Pricing Rule</span>
        </button>
      </div>

      {pricingRules.map((rule) => (
        <div key={rule.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {rule.campName}
            </h4>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-600 hover:text-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Base Pricing</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Base Price:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(rule.basePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weekend:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    +{((rule.weekendMultiplier - 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Peak Season:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    +{((rule.seasonalMultiplier - 1) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Group Discounts</h5>
              <div className="space-y-2">
                {rule.groupDiscounts.map((discount, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {discount.minSize}+ people:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      -{discount.discount}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Early Bird Discounts</h5>
              <div className="space-y-2">
                {rule.advanceBookingDiscount.map((discount, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {discount.days} days advance:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      -{discount.discount}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderPromos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Promotional Codes
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {promoCodes.map((promo) => (
          <div key={promo.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 dark:bg-primary-900/20 px-3 py-1 rounded-lg">
                  <span className="text-primary-600 dark:text-primary-400 font-mono font-bold">
                    {promo.code}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {promo.description}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {promo.type === 'percentage' ? `${promo.value}% off` : `${formatCurrency(promo.value)} off`}
                    {promo.minAmount && ` on orders above ${formatCurrency(promo.minAmount)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Valid Period</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(promo.validFrom)} - {formatDate(promo.validTo)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Usage</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {promo.usedCount} / {promo.usageLimit}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {promo.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Max Discount</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {promo.maxDiscount ? formatCurrency(promo.maxDiscount) : 'No limit'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage pricing, payments, and financial reports
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSign },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'pricing', label: 'Pricing Rules', icon: TrendingUp },
            { id: 'promos', label: 'Promo Codes', icon: Percent }
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'pricing' && renderPricing()}
      {activeTab === 'promos' && renderPromos()}
    </div>
  )
}

export default FinancialManagement
