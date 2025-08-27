import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Users,AlertTriangle,LineChart,
  Activity,
  Lightbulb,
  Rocket
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/format'

interface AIInsight {
  id: string
  type: 'opportunity' | 'warning' | 'recommendation' | 'prediction'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  actionable: boolean
  category: 'pricing' | 'marketing' | 'operations' | 'customer'
  data?: any
}

interface PredictiveMetric {
  metric: string
  current: number
  predicted: number
  change: number
  confidence: number
  timeframe: string
}

interface CustomerSegment {
  id: string
  name: string
  size: number
  revenue: number
  avgBookingValue: number
  retentionRate: number
  growthRate: number
  characteristics: string[]
}

const AdvancedAnalytics = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'segments' | 'optimization'>('insights')
  const [timeRange, setTimeRange] = useState('30d')

  // Mock AI insights
  const aiInsights: AIInsight[] = [
    {
      id: 'AI001',
      type: 'opportunity',
      title: 'Peak Season Pricing Opportunity',
      description: 'Analysis shows you can increase prices by 25% during Dec 20-Jan 5 without affecting demand. Competitor analysis supports this pricing strategy.',
      impact: 'high',
      confidence: 87,
      actionable: true,
      category: 'pricing',
      data: { potentialRevenue: 45000, priceIncrease: 25 }
    },
    {
      id: 'AI002',
      type: 'warning',
      title: 'Customer Churn Risk Detected',
      description: '15% of your repeat customers show signs of churn based on booking patterns and engagement metrics. Immediate retention campaign recommended.',
      impact: 'high',
      confidence: 92,
      actionable: true,
      category: 'customer',
      data: { affectedCustomers: 23, potentialLoss: 78000 }
    },
    {
      id: 'AI003',
      type: 'recommendation',
      title: 'Optimize Weekend Availability',
      description: 'Weekend slots are consistently overbooked. Adding 2 more weekend dates per month could increase revenue by 18%.',
      impact: 'medium',
      confidence: 78,
      actionable: true,
      category: 'operations',
      data: { additionalRevenue: 28000, requiredSlots: 8 }
    },
    {
      id: 'AI004',
      type: 'prediction',
      title: 'Seasonal Demand Forecast',
      description: 'Winter season demand predicted to be 35% higher than last year. Consider expanding capacity or adjusting pricing strategy.',
      impact: 'high',
      confidence: 84,
      actionable: true,
      category: 'marketing',
      data: { demandIncrease: 35, seasont: '2024-12-15' }
    }
  ]

  // Mock predictive metrics
  const predictiveMetrics: PredictiveMetric[] = [
    {
      metric: 'Monthly Revenue',
      current: 125000,
      predicted: 156000,
      change: 24.8,
      confidence: 89,
      timeframe: 'Next 30 days'
    },
    {
      metric: 'Booking Conversion',
      current: 12.5,
      predicted: 15.2,
      change: 21.6,
      confidence: 76,
      timeframe: 'Next 30 days'
    },
    {
      metric: 'Customer Retention',
      current: 68,
      predicted: 72,
      change: 5.9,
      confidence: 82,
      timeframe: 'Next 90 days'
    },
    {
      metric: 'Average Booking Value',
      current: 3200,
      predicted: 3680,
      change: 15.0,
      confidence: 71,
      timeframe: 'Next 60 days'
    }
  ]

  // Mock customer segments
  const customerSegments: CustomerSegment[] = [
    {
      id: 'SEG001',
      name: 'Adventure Enthusiasts',
      size: 156,
      revenue: 487000,
      avgBookingValue: 3120,
      retentionRate: 78,
      growthRate: 23,
      characteristics: ['High-value bookings', 'Frequent travelers', 'Social media active', 'Group organizers']
    },
    {
      id: 'SEG002',
      name: 'Family Campers',
      size: 89,
      revenue: 234000,
      avgBookingValue: 2630,
      retentionRate: 85,
      growthRate: 12,
      characteristics: ['Weekend bookings', 'Safety-conscious', 'Budget-aware', 'Repeat customers']
    },
    {
      id: 'SEG003',
      name: 'Corporate Groups',
      size: 34,
      revenue: 198000,
      avgBookingValue: 5820,
      retentionRate: 92,
      growthRate: 45,
      characteristics: ['Large groups', 'Premium services', 'Advance booking', 'Team building focus']
    },
    {
      id: 'SEG004',
      name: 'Solo Travelers',
      size: 67,
      revenue: 145000,
      avgBookingValue: 2160,
      retentionRate: 45,
      growthRate: 8,
      characteristics: ['Flexible dates', 'Budget-conscious', 'Experience-focused', 'Social seekers']
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Rocket className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'recommendation': return <Lightbulb className="w-5 h-5" />
      case 'prediction': return <Brain className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'warning': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'recommendation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'prediction': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-400">
              AI-Powered Business Insights
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              Advanced analytics and machine learning recommendations for your business
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">
              {aiInsights.length}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Active Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">
              {aiInsights.filter(i => i.actionable).length}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Actionable Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">
              {Math.round(aiInsights.reduce((acc, i) => acc + i.confidence, 0) / aiInsights.length)}%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Avg Confidence</div>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {aiInsights.map((insight) => (
          <div key={insight.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  getInsightColor(insight.type)
                )}>
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getInsightColor(insight.type)
                    )}>
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </span>
                    <span className={cn(
                      "text-sm font-medium",
                      getImpactColor(insight.impact)
                    )}>
                      {insight.impact.toUpperCase()} IMPACT
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
              {insight.actionable && (
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Take Action
                </button>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {insight.description}
            </p>

            {insight.data && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {insight.data.potentialRevenue && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Potential Revenue:</span>
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(insight.data.potentialRevenue)}
                      </div>
                    </div>
                  )}
                  {insight.data.priceIncrease && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Recommended Increase:</span>
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        +{insight.data.priceIncrease}%
                      </div>
                    </div>
                  )}
                  {insight.data.affectedCustomers && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Affected Customers:</span>
                      <div className="font-semibold text-orange-600 dark:text-orange-400">
                        {insight.data.affectedCustomers}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderPredictionsTab = () => (
    <div className="space-y-6">
      {/* Predictions Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Predictive Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered forecasts for key business metrics
        </p>
      </div>

      {/* Predictive Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictiveMetrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {metric.metric}
              </h4>
              <div className="flex items-center space-x-2">
                {metric.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  metric.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {metric.metric.includes('Revenue') || metric.metric.includes('Value') 
                    ? formatCurrency(metric.current)
                    : metric.metric.includes('Rate') || metric.metric.includes('Conversion')
                    ? `${metric.current}%`
                    : metric.current.toLocaleString()
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Predicted:</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {metric.metric.includes('Revenue') || metric.metric.includes('Value')
                    ? formatCurrency(metric.predicted)
                    : metric.metric.includes('Rate') || metric.metric.includes('Conversion')
                    ? `${metric.predicted}%`
                    : metric.predicted.toLocaleString()
                  }
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metric.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metric.confidence}%
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metric.timeframe}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Revenue Forecast
        </h4>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Interactive forecast chart would be here</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSegmentsTab = () => (
    <div className="space-y-6">
      {/* Segments Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Customer Segments
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          AI-identified customer groups and their characteristics
        </p>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customerSegments.map((segment) => (
          <div key={segment.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {segment.name}
              </h4>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {segment.size} customers
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue:</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(segment.revenue)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Booking:</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(segment.avgBookingValue)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Retention:</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {segment.retentionRate}%
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Growth:</span>
                <div className={cn(
                  "font-semibold",
                  segment.growthRate > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {segment.growthRate > 0 ? '+' : ''}{segment.growthRate}%
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Key Characteristics:
              </span>
              <div className="flex flex-wrap gap-2">
                {segment.characteristics.map((char, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderOptimizationTab = () => (
    <div className="space-y-6">
      {/* Optimization Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Business Optimization
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered recommendations to optimize your business performance
        </p>
      </div>

      {/* Optimization Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Revenue Optimization
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Revenue:</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹1,25,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Optimized Potential:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">₹1,68,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Improvement:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">+34.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Customer Acquisition
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Rate:</span>
              <span className="font-semibold text-gray-900 dark:text-white">12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Optimized Rate:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">18.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Improvement:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">+45.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recommended Actions
        </h4>
        <div className="space-y-4">
          {[
            {
              action: 'Implement dynamic pricing for peak seasons',
              impact: 'High',
              effort: 'Medium',
              timeline: '2 weeks'
            },
            {
              action: 'Launch targeted marketing campaign for corporate groups',
              impact: 'High',
              effort: 'Low',
              timeline: '1 week'
            },
            {
              action: 'Optimize booking flow to reduce abandonment',
              impact: 'Medium',
              effort: 'High',
              timeline: '4 weeks'
            },
            {
              action: 'Introduce loyalty program for repeat customers',
              impact: 'Medium',
              effort: 'Medium',
              timeline: '3 weeks'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {item.action}
                </h5>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <span>Impact: <span className={cn(
                    "font-medium",
                    item.impact === 'High' ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                  )}>{item.impact}</span></span>
                  <span>Effort: <span className="font-medium">{item.effort}</span></span>
                  <span>Timeline: <span className="font-medium">{item.timeline}</span></span>
                </div>
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm transition-colors">t
              </button>
            </div>
          ))}
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
            Advanced Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered insights and predictive analytics for your business
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'insights', label: 'AI Insights', icon: Brain },
            { id: 'predictions', label: 'Predictions', icon: TrendingUp },
            { id: 'segments', label: 'Customer Segments', icon: Users },
            { id: 'optimization', label: 'Optimization', icon: Target }
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
      {activeTab === 'insights' && renderInsightsTab()}
      {activeTab === 'predictions' && renderPredictionsTab()}
      {activeTab === 'segments' && renderSegmentsTab()}
      {activeTab === 'optimization' && renderOptimizationTab()}
    </div>
  )
}

export default AdvancedAnalytics
