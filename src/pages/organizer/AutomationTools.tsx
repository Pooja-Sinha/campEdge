import {
  Zap,
  Play,Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  Mail,
  MessageSquare,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Filter,
  Target,
  Activity,
  Bot,
  Workflow
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/format'

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: 'booking_created' | 'booking_confirmed' | 'payment_received' | 'review_received' | 'date_approaching' | 'customer_inactive'
    conditions: any
  }
  actions: {
    type: 'send_email' | 'send_sms' | 'update_status' | 'create_task' | 'adjust_pricing' | 'send_notification'
    config: any
  }[]
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
  successRate: number
  createdAt: string
}

interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: 'communication' | 'pricing' | 'operations' | 'marketing'
  triggers: string[]
  actions: string[]
  popularity: number
}

// interface WorkflowStep removed - unused

const AutomationTools = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'workflows' | 'analytics'>('rules')
  const [_showRuleModal, setShowRuleModal] = useState(false)
  const [_editingRule, setEditingRule] = useState<AutomationRule | null>(null)

  // Mock data
  const automationRules: AutomationRule[] = [
    {
      id: 'AR001',
      name: 'Booking Confirmation Email',
      description: 'Automatically send confirmation email when booking is created',
      trigger: {
        type: 'booking_created',
        conditions: { status: 'confirmed' }
      },
      actions: [
        {
          type: 'send_email',
          config: {
            template: 'booking_confirmation',
            delay: 0
          }
        }
      ],
      isActive: true,
      lastTriggered: '2024-11-15T14:30:00Z',
      triggerCount: 156,
      successRate: 98.7,
      createdAt: '2024-10-01T10:00:00Z'
    },
    {
      id: 'AR002',
      name: 'Pre-Trip Reminder',
      description: 'Send reminder 24 hours before trip starts',
      trigger: {
        type: 'date_approaching',
        conditions: { hours_before: 24 }
      },
      actions: [
        {
          type: 'send_sms',
          config: {
            template: 'pre_trip_reminder',
            delay: 0
          }
        },
        {
          type: 'send_email',
          config: {
            template: 'trip_preparation',
            delay: 0
          }
        }
      ],
      isActive: true,
      lastTriggered: '2024-11-14T18:00:00Z',
      triggerCount: 89,
      successRate: 95.5,
      createdAt: '2024-10-05T10:00:00Z'
    },
    {
      id: 'AR003',
      name: 'Dynamic Pricing Adjustment',
      description: 'Adjust pricing based on demand and occupancy',
      trigger: {
        type: 'booking_created',
        conditions: { occupancy_threshold: 80 }
      },
      actions: [
        {
          type: 'adjust_pricing',
          config: {
            multiplier: 1.2,
            duration: 'until_booking'
          }
        }
      ],
      isActive: true,
      lastTriggered: '2024-11-13T16:45:00Z',
      triggerCount: 23,
      successRate: 87.0,
      createdAt: '2024-10-10T10:00:00Z'
    },
    {
      id: 'AR004',
      name: 'Review Request Follow-up',
      description: 'Request review 3 days after trip completion',
      trigger: {
        type: 'date_approaching',
        conditions: { days_after_trip: 3 }
      },
      actions: [
        {
          type: 'send_email',
          config: {
            template: 'review_request',
            delay: 0
          }
        }
      ],
      isActive: false,
      lastTriggered: '2024-11-10T12:00:00Z',
      triggerCount: 67,
      successRate: 34.5,
      createdAt: '2024-10-15T10:00:00Z'
    },
    {
      id: 'AR005',
      name: 'Customer Win-back Campaign',
      description: 'Re-engage customers who haven\'t booked in 6 months',
      trigger: {
        type: 'customer_inactive',
        conditions: { months_inactive: 6 }
      },
      actions: [
        {
          type: 'send_email',
          config: {
            template: 'winback_offer',
            delay: 0
          }
        }
      ],
      isActive: true,
      lastTriggered: '2024-11-12T09:00:00Z',
      triggerCount: 12,
      successRate: 15.8,
      createdAt: '2024-10-20T10:00:00Z'
    }
  ]

  const automationTemplates: AutomationTemplate[] = [
    {
      id: 'AT001',
      name: 'Complete Booking Journey',
      description: 'Full customer communication flow from booking to post-trip',
      category: 'communication',
      triggers: ['booking_created', 'date_approaching', 'trip_completed'],
      actions: ['send_email', 'send_sms', 'create_task'],
      popularity: 95
    },
    {
      id: 'AT002',
      name: 'Smart Pricing Engine',
      description: 'Dynamic pricing based on demand, season, and competition',
      category: 'pricing',
      triggers: ['booking_created', 'date_approaching', 'occupancy_change'],
      actions: ['adjust_pricing', 'send_notification'],
      popularity: 87
    },
    {
      id: 'AT003',
      name: 'Customer Retention System',
      description: 'Automated follow-ups and loyalty programs',
      category: 'marketing',
      triggers: ['trip_completed', 'customer_inactive', 'review_received'],
      actions: ['send_email', 'create_task', 'update_status'],
      popularity: 78
    },
    {
      id: 'AT004',
      name: 'Operations Optimizer',
      description: 'Streamline operations with automated task management',
      category: 'operations',
      triggers: ['booking_created', 'payment_received', 'date_approaching'],
      actions: ['create_task', 'update_status', 'send_notification'],
      popularity: 65
    }
  ]  //  //  

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'booking_created': return <Calendar className="w-4 h-4" />
      case 'booking_confirmed': return <CheckCircle className="w-4 h-4" />
      case 'payment_received': return <DollarSign className="w-4 h-4" />
      case 'review_received': return <MessageSquare className="w-4 h-4" />
      case 'date_approaching': return <Clock className="w-4 h-4" />
      case 'customer_inactive': return <Users className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return <Mail className="w-4 h-4" />
      case 'send_sms': return <MessageSquare className="w-4 h-4" />
      case 'update_status': return <Settings className="w-4 h-4" />
      case 'create_task': return <Plus className="w-4 h-4" />
      case 'adjust_pricing': return <DollarSign className="w-4 h-4" />
      case 'send_notification': return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pricing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'operations': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'marketing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
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
            Automation Rules
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage automated business processes
          </p>
        </div>
        <button
          onClick={() => setShowRuleModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {automationRules.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {rule.name}
                  </h4>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    rule.isActive 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  )}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {rule.description}
                </p>

                <div className="flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>Triggered {rule.triggerCount} times</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{rule.successRate}% success rate</span>
                  </div>
                  {rule.lastTriggered && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last: {formatDate(rule.lastTriggered)}</span>
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

            {/* Rule Flow Visualization */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                  {getTriggerIcon(rule.trigger.type)}
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                    {rule.trigger.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-400" />

                <div className="flex items-center space-x-2">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                        {getActionIcon(action.type)}
                        <span className="text-sm font-medium text-green-800 dark:text-green-400">
                          {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      {index < rule.actions.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Automation Templates
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pre-built automation workflows for common business scenarios
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automationTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Workflow className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getCategoryColor(template.category)
                  )}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {template.popularity}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Popular
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {template.description}
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Triggers:
                </span>
                <div className="flex flex-wrap gap-1">
                  {template.triggers.map((trigger, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs"
                    >
                      {trigger.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Actions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {template.actions.map((action, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-xs"
                    >
                      {action.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Use Template
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Visual Workflow Builder
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create complex automation workflows with drag-and-drop interface
          </p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Workflow Canvas Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-96">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Visual Workflow Builder
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop components to create complex automation workflows
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
              Start Building
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Components */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">Triggers</h5>
          <div className="space-y-2">
            {['Booking Created', 'Payment Received', 'Date Approaching', 'Review Received'].map((trigger, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-800 dark:text-blue-400">{trigger}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">Conditions</h5>
          <div className="space-y-2">
            {['If/Then', 'Time Delay', 'Filter', 'Branch'].map((condition, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                <Filter className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-800 dark:text-yellow-400">{condition}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">Actions</h5>
          <div className="space-y-2">
            {['Send Email', 'Send SMS', 'Update Status', 'Create Task'].map((action, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-800 dark:text-green-400">{action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">Integrations</h5>
          <div className="space-y-2">
            {['Webhook', 'API Call', 'Database', 'External Service'].map((integration, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-800 dark:text-purple-400">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Automation Analytics
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitor and analyze the performance of your automation rules
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">94.2%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Saved</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">156h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Rules</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {automationRules.filter(r => r.isActive).length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Rule Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Rule Performance
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Executions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Triggered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {automationRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {rule.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {rule.triggerCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${rule.successRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {rule.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {rule.lastTriggered ? formatDate(rule.lastTriggered) : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      rule.isActive 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    )}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
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
            Automation Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Automate your business processes and save time
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', label: 'Automation Rules', icon: Zap },
            { id: 'templates', label: 'Templates', icon: Workflow },
            { id: 'workflows', label: 'Visual Builder', icon: Bot },
            { id: 'analytics', label: 'Analytics', icon: Activity }
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
      {activeTab === 'templates' && renderTemplatesTab()}
      {activeTab === 'workflows' && renderWorkflowsTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </div>
  )
}

export default AutomationTools
