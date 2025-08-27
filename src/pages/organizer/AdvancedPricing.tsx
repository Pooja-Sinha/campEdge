import {TrendingUp,
  Calendar,
  Users,
  Zap,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,CheckCircle,
  Target,
  Clock,
  Percent
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/format'

interface PricingRule {
  id: string
  name: string
  description: string
  type: 'seasonal' | 'weekend' | 'holiday' | 'demand' | 'early_bird' | 'last_minute' | 'group_size' | 'duration'
  isActive: boolean
  priority: number
  conditions: {
    startDate?: string
    endDate?: string
    daysOfWeek?: number[]
    minParticipants?: number
    maxParticipants?: number
    minDaysAdvance?: number
    maxDaysAdvance?: number
    minDuration?: number
    maxDuration?: number
    occupancyThreshold?: number
  }
  adjustment: {
    type: 'percentage' | 'fixed'
    value: number
    operation: 'increase' | 'decrease'
  }
  applicableCamps: string[]
  createdAt: string
  updatedAt: string
}

interface DynamicPricingConfig {
  enabled: boolean
  baseFactors: {
    demandWeight: number
    seasonalWeight: number
    competitorWeight: number
    inventoryWeight: number
  }
  constraints: {
    minPriceMultiplier: number
    maxPriceMultiplier: number
    updateFrequency: 'hourly' | 'daily' | 'weekly'
  }
}

const AdvancedPricing = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'dynamic' | 'analytics'>('rules')
  const [_showRuleModal, setShowRuleModal] = useState(false)
  const [_editingRule, setEditingRule] = useState<PricingRule | null>(null)

  // Mock data
  const pricingRules: PricingRule[] = [
    {
      id: 'PR001',
      name: 'Winter Peak Season',
      description: 'Higher pricing during peak winter months',
      type: 'seasonal',
      isActive: true,
      priority: 1,
      conditions: {
        startDate: '2024-12-15',
        endDate: '2025-01-15'
      },
      adjustment: {
        type: 'percentage',
        value: 30,
        operation: 'increase'
      },
      applicableCamps: ['C001', 'C002'],
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z'
    },
    {
      id: 'PR002',
      name: 'Weekend Premium',
      description: 'Weekend pricing premium',
      type: 'weekend',
      isActive: true,
      priority: 2,
      conditions: {
        daysOfWeek: [5, 6] // Friday, Saturday
      },
      adjustment: {
        type: 'percentage',
        value: 15,
        operation: 'increase'
      },
      applicableCamps: ['C001', 'C002', 'C003'],
      createdAt: '2024-10-15T10:00:00Z',
      updatedAt: '2024-10-15T10:00:00Z'
    },
    {
      id: 'PR003',
      name: 'Early Bird Discount',
      description: 'Discount for bookings made 30+ days in advance',
      type: 'early_bird',
      isActive: true,
      priority: 3,
      conditions: {
        minDaysAdvance: 30
      },
      adjustment: {
        type: 'percentage',
        value: 10,
        operation: 'decrease'
      },
      applicableCamps: ['C001', 'C002'],
      createdAt: '2024-10-01T10:00:00Z',
      updatedAt: '2024-10-01T10:00:00Z'
    },
    {
      id: 'PR004',
      name: 'Large Group Discount',
      description: 'Discount for groups of 10 or more',
      type: 'group_size',
      isActive: true,
      priority: 4,
      conditions: {
        minParticipants: 10
      },
      adjustment: {
        type: 'percentage',
        value: 15,
        operation: 'decrease'
      },
      applicableCamps: ['C001', 'C003'],
      createdAt: '2024-09-15T10:00:00Z',
      updatedAt: '2024-09-15T10:00:00Z'
    },
    {
      id: 'PR005',
      name: 'High Demand Surge',
      description: 'Automatic price increase when occupancy > 80%',
      type: 'demand',
      isActive: true,
      priority: 5,
      conditions: {
        occupancyThreshold: 80
      },
      adjustment: {
        type: 'percentage',
        value: 20,
        operation: 'increase'
      },
      applicableCamps: ['C001', 'C002', 'C003'],
      createdAt: '2024-09-01T10:00:00Z',
      updatedAt: '2024-09-01T10:00:00Z'
    }
  ]  // 

  const dynamicPricingConfig: DynamicPricingConfig = {
    enabled: true,
    baseFactors: {
      demandWeight: 40,
      seasonalWeight: 30,
      competitorWeight: 20,
      inventoryWeight: 10
    },
    constraints: {
      minPriceMultiplier: 0.7,
      maxPriceMultiplier: 2.0,
      updateFrequency: 'daily'
    }
  }

  // const camps = [
  //   { id: 'C001', name: 'Triund Trek & Camping' },
  //   { id: 'C002', name: 'Desert Safari Experience' },
  //   { id: 'C003', name: 'Himalayan Base Camp' }
  // ]

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'seasonal': return <Calendar className="w-4 h-4" />
      case 'weekend': return <Calendar className="w-4 h-4" />
      case 'holiday': return <Calendar className="w-4 h-4" />
      case 'demand': return <TrendingUp className="w-4 h-4" />
      case 'early_bird': return <Clock className="w-4 h-4" />
      case 'last_minute': return <Zap className="w-4 h-4" />
      case 'group_size': return <Users className="w-4 h-4" />
      case 'duration': return <Clock className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'seasonal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'weekend': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'holiday': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'demand': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'early_bird': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'last_minute': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'group_size': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'duration': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatAdjustment = (adjustment: PricingRule['adjustment']) => {
    const sign = adjustment.operation === 'increase' ? '+' : '-'
    const value = adjustment.type === 'percentage' ? `${adjustment.value}%` : formatCurrency(adjustment.value)
    return `${sign}${value}`
  }

  const toggleRule = (ruleId: string) => {
    console.log('Toggle rule:', ruleId)
    // TODO: Implement API call to toggle rule
  }

  const deleteRule = (ruleId: string) => {
    console.log('Delete rule:', ruleId)
    // TODO: Implement API call to delete rule
  }

  const renderRulesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pricing Rules
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage automated pricing rules
          </p>
        </div>
        <button
          onClick={() => setShowRuleModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {pricingRules.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    {getRuleTypeIcon(rule.type)}
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {rule.name}
                    </h4>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getRuleTypeColor(rule.type)
                  )}>
                    {rule.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    formatAdjustment(rule.adjustment).startsWith('+')
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  )}>
                    {formatAdjustment(rule.adjustment)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {rule.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>Priority: {rule.priority}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{rule.applicableCamps.length} camps</span>
                  </div>
                  {rule.conditions.startDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(rule.conditions.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    rule.isActive
                      ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                  title={rule.isActive ? 'Disable rule' : 'Enable rule'}
                >
                  {rule.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setEditingRule(rule)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit rule"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderDynamicPricingTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dynamic Pricing
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered automatic pricing optimization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {dynamicPricingConfig.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            className={cn(
              "p-2 rounded-lg transition-colors",
              dynamicPricingConfig.enabled
                ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {dynamicPricingConfig.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pricing Factors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Pricing Factors
          </h4>
          <div className="space-y-4">
            {Object.entries(dynamicPricingConfig.baseFactors).map(([factor, weight]) => (
              <div key={factor}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {factor.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {weight}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Price Constraints
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Price Multiplier
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.1"
                  value={dynamicPricingConfig.constraints.minPriceMultiplier}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {dynamicPricingConfig.constraints.minPriceMultiplier}x
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Price Multiplier
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={dynamicPricingConfig.constraints.maxPriceMultiplier}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {dynamicPricingConfig.constraints.maxPriceMultiplier}x
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Frequency
              </label>
              <select
                value={dynamicPricingConfig.constraints.updateFrequency}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Performance Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">+12.5%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Increase</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">89%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹3,450</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">1.2x</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Price Multiplier</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h4 className="text-lg font-medium text-blue-900 dark:text-blue-400 mb-2">
              AI Pricing Insights
            </h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <p>• Demand is expected to increase by 25% next weekend - consider raising prices</p>
              <p>• Your competitor "Mountain Adventures" lowered prices by 10% - monitor bookings</p>
              <p>• Weather forecast shows clear skies for next week - good opportunity for premium pricing</p>
              <p>• Early bird bookings are 30% higher than last month - consider extending the discount period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pricing Analytics
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Analyze the performance of your pricing strategies
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenue Impact</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">+₹45,000</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Price Increase</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">18.5%</p>
            </div>
            <Percent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rules Applied</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,247</p>
            </div>
            <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">12.8%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Rule Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Rule Performance
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rule
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue Impact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pricingRules.slice(0, 5).map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      {getRuleTypeIcon(rule.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {Math.floor(Math.random() * 500) + 100}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    +₹{(Math.random() * 20000 + 5000).toFixed(0)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {(Math.random() * 10 + 10).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.random() * 60 + 40}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {(Math.random() * 60 + 40).toFixed(0)}%
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Pricing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Optimize your pricing with intelligent rules and dynamic adjustments
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', label: 'Pricing Rules', icon: Target },
            { id: 'dynamic', label: 'Dynamic Pricing', icon: Zap },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
      {activeTab === 'rules' && renderRulesTab()}
      {activeTab === 'dynamic' && renderDynamicPricingTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </div>
  )
}

export default AdvancedPricing
