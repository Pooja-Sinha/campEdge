import {
  MessageSquare,
  Mail,
  Send,
  Users,
  Bell,
  Settings,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface Message {
  id: string
  type: 'email' | 'sms' | 'notification'
  subject: string
  content: string
  recipients: number
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  createdAt: string
  scheduledAt?: string
  sentAt?: string
  openRate?: number
  clickRate?: number
}

interface Template {
  id: string
  name: string
  type: 'booking_confirmation' | 'reminder' | 'cancellation' | 'promotional' | 'custom'
  subject: string
  content: string
  isActive: boolean
  lastUsed?: string
}

interface Campaign {
  id: string
  name: string
  type: 'email' | 'sms'
  status: 'draft' | 'active' | 'completed' | 'paused'
  targetAudience: string
  sentCount: number
  openRate: number
  clickRate: number
  createdAt: string
}

const CommunicationTools = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'campaigns' | 'automation'>('messages')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'failed'>('all')
  const [showComposeModal, setShowComposeModal] = useState(false)

  // Mock data
  const messages: Message[] = [
    {
      id: 'M001',
      type: 'email',
      subject: 'Booking Confirmation - Triund Trek',
      content: 'Thank you for booking the Triund Trek experience...',
      recipients: 1,
      status: 'sent',
      createdAt: '2024-11-15T10:30:00Z',
      sentAt: '2024-11-15T10:35:00Z',
      openRate: 100,
      clickRate: 25
    },
    {
      id: 'M002',
      type: 'sms',
      subject: 'Reminder: Trek starts tomorrow',
      content: 'Hi! Your Triund Trek starts tomorrow at 6 AM. Please arrive 30 minutes early...',
      recipients: 4,
      status: 'sent',
      createdAt: '2024-11-14T18:00:00Z',
      sentAt: '2024-11-14T18:05:00Z'
    },
    {
      id: 'M003',
      type: 'email',
      subject: 'Winter Special Offer - 20% Off',
      content: 'Don\'t miss our winter special offer...',
      recipients: 156,
      status: 'scheduled',
      createdAt: '2024-11-13T15:20:00Z',
      scheduledAt: '2024-11-20T09:00:00Z'
    }
  ]

  const templates: Template[] = [
    {
      id: 'T001',
      name: 'Booking Confirmation',
      type: 'booking_confirmation',
      subject: 'Booking Confirmed - {{camp_name}}',
      content: 'Dear {{customer_name}}, your booking for {{camp_name}} has been confirmed...',
      isActive: true,
      lastUsed: '2024-11-15T10:30:00Z'
    },
    {
      id: 'T002',
      name: 'Pre-Trip Reminder',
      type: 'reminder',
      subject: 'Your adventure starts tomorrow!',
      content: 'Hi {{customer_name}}, your {{camp_name}} experience starts tomorrow...',
      isActive: true,
      lastUsed: '2024-11-14T18:00:00Z'
    },
    {
      id: 'T003',
      name: 'Winter Promotion',
      type: 'promotional',
      subject: 'Special Winter Offer - Limited Time!',
      content: 'Experience the magic of winter camping with our special offer...',
      isActive: false
    }
  ]

  const campaigns: Campaign[] = [
    {
      id: 'C001',
      name: 'Winter 2024 Promotion',
      type: 'email',
      status: 'active',
      targetAudience: 'All Customers',
      sentCount: 1250,
      openRate: 24.5,
      clickRate: 3.2,
      createdAt: '2024-11-01T10:00:00Z'
    },
    {
      id: 'C002',
      name: 'Booking Reminders',
      type: 'sms',
      status: 'completed',
      targetAudience: 'Upcoming Bookings',
      sentCount: 45,
      openRate: 95.5,
      clickRate: 12.8,
      createdAt: '2024-10-15T14:30:00Z'
    }
  ]

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'sms': return <MessageSquare className="w-4 h-4" />
      case 'notification': return <Bell className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const renderMessages = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
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
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={() => setShowComposeModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {getTypeIcon(message.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.subject}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {message.recipients}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(message.status)
                    )}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {message.status === 'sent' && message.openRate !== undefined && (
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">
                          Open: {message.openRate}%
                        </div>
                        {message.clickRate !== undefined && (
                          <div className="text-gray-600 dark:text-gray-400">
                            Click: {message.clickRate}%
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {message.status === 'scheduled' && message.scheduledAt
                      ? formatDate(message.scheduledAt)
                      : formatDate(message.createdAt)
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {message.status === 'draft' && (
                        <button className="p-1 text-green-600 hover:text-green-700 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-red-600 hover:text-red-700 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="More">
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
    </div>
  )

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Message Templates
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {template.name}
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

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {template.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Subject:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {template.subject}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Content:</span>
                <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {template.content}
                </div>
              </div>
              {template.lastUsed && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Used:</span>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(template.lastUsed)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                template.isActive 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
              )}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Marketing Campaigns
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {campaign.name}
                </h4>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getStatusColor(campaign.status)
                )}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  {getTypeIcon(campaign.type)}
                  <span className="ml-1">{campaign.type.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Target:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {campaign.targetAudience}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Sent:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {campaign.sentCount.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Open: {campaign.openRate}% | Click: {campaign.clickRate}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Automated Messages
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Automation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Booking Confirmations
            </h4>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Automatically send confirmation emails when bookings are made
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Trigger:</span>
              <span className="text-gray-900 dark:text-white">New Booking</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Delay:</span>
              <span className="text-gray-900 dark:text-white">Immediate</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sent this month:</span>
              <span className="text-gray-900 dark:text-white">45</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Pre-Trip Reminders
            </h4>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Send reminder messages 24 hours before the trip starts
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Trigger:</span>
              <span className="text-gray-900 dark:text-white">24h before trip</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="text-gray-900 dark:text-white">SMS + Email</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sent this month:</span>
              <span className="text-gray-900 dark:text-white">32</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Review Requests
            </h4>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">Paused</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Request reviews from customers 3 days after their trip ends
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Trigger:</span>
              <span className="text-gray-900 dark:text-white">3 days after trip</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="text-gray-900 dark:text-white">Email</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Response rate:</span>
              <span className="text-gray-900 dark:text-white">28%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Win-back Campaign
            </h4>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-600 dark:text-orange-400">Draft</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Re-engage customers who haven't booked in the last 6 months
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Trigger:</span>
              <span className="text-gray-900 dark:text-white">6 months inactive</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="text-gray-900 dark:text-white">Email</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Target audience:</span>
              <span className="text-gray-900 dark:text-white">89 customers</span>
            </div>
          </div>
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
            Communication Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer communications and marketing campaigns
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
            </div>
            <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24.5%</p>
            </div>
            <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Automations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
            </div>
            <Settings className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'campaigns', label: 'Campaigns', icon: Users },
            { id: 'automation', label: 'Automation', icon: Settings }
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
      {activeTab === 'messages' && renderMessages()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'automation' && renderAutomation()}

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Compose Message
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message Type
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="notification">Push Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipients
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All Customers</option>
                  <option value="recent">Recent Customers</option>
                  <option value="upcoming">Upcoming Bookings</option>
                  <option value="custom">Custom Segment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunicationTools
