import {
  Menu,
  X,
  Home,
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Star,
  Phone
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatCurrency, formatDate } from '../../utils/format'

interface MobileQuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  color: string
}

interface MobileNotification {
  id: string
  type: 'booking' | 'review' | 'payment' | 'system'
  title: string
  message: string
  time: string
  isRead: boolean
}

const MobileOptimizedDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<'dashboard' | 'bookings' | 'calendar' | 'notifications'>('dashboard')

  // Mock data optimized for mobile
  const quickActions: MobileQuickAction[] = [
    {
      id: 'add-camp',
      label: 'Add Camp',
      icon: Plus,
      action: () => console.log('Add camp'),
      color: 'bg-blue-500'
    },
    {
      id: 'view-bookings',
      label: 'Bookings',
      icon: Calendar,
      action: () => setActiveView('bookings'),
      color: 'bg-green-500'
    },
    {
      id: 'check-reviews',
      label: 'Reviews',
      icon: Star,
      action: () => console.log('Check reviews'),
      color: 'bg-yellow-500'
    },
    {
      id: 'contact-support',
      label: 'Support',
      icon: Phone,
      action: () => console.log('Contact support'),
      color: 'bg-purple-500'
    }
  ]

  const recentBookings = [
    {
      id: 'B001',
      customerName: 'Arjun Sharma',
      campName: 'Triund Trek',
      date: '2024-12-20',
      amount: 3000,
      status: 'pending',
      participants: 2
    },
    {
      id: 'B002',
      customerName: 'Priya Patel',
      campName: 'Desert Safari',
      date: '2024-12-22',
      amount: 4500,
      status: 'confirmed',
      participants: 4
    },
    {
      id: 'B003',
      customerName: 'Vikram Singh',
      campName: 'Himalayan Base',
      date: '2024-12-25',
      amount: 6000,
      status: 'pending',
      participants: 3
    }
  ]

  const notifications: MobileNotification[] = [
    {
      id: 'N001',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Arjun Sharma wants to book Triund Trek for Dec 20',
      time: '5 min ago',
      isRead: false
    },
    {
      id: 'N002',
      type: 'review',
      title: 'New Review',
      message: 'Sneha Patel left a 5-star review for Desert Safari',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: 'N003',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹4,500 received from Priya Patel',
      time: '2 hours ago',
      isRead: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4" />
      case 'review': return <Star className="w-4 h-4" />
      case 'payment': return <DollarSign className="w-4 h-4" />
      case 'system': return <Bell className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Today's Revenue</p>
              <p className="text-lg font-bold text-gray-900">₹12,500</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">New Bookings</p>
              <p className="text-lg font-bold text-gray-900">8</p>
            </div>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Pending Reviews</p>
              <p className="text-lg font-bold text-gray-900">3</p>
            </div>
            <MessageSquare className="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Rating</p>
              <p className="text-lg font-bold text-gray-900">4.8</p>
            </div>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", action.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-700 text-center">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3>
          <button
            onClick={() => setActiveView('bookings')}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentBookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {booking.customerName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {booking.campName} • {booking.participants} guests
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(booking.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(booking.amount)}
                </p>
                <span className={cn(
                  "inline-block px-2 py-1 rounded-full text-xs font-medium",
                  getStatusColor(booking.status)
                )}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {booking.customerName}
                </h4>
                <p className="text-xs text-gray-600">
                  {booking.campName}
                </p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{booking.participants} guests</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(booking.amount)}
              </span>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getStatusColor(booking.status)
                )}>
                  {booking.status}
                </span>
                {booking.status === 'pending' && (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "bg-white rounded-lg p-4 shadow-sm border",
            !notification.isRead && "border-l-4 border-l-blue-500"
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">
                {notification.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {notification.time}
              </p>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return renderDashboard()
      case 'bookings': return renderBookings()
      case 'notifications': return renderNotifications()
      default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            {activeView === 'dashboard' && 'Dashboard'}
            {activeView === 'bookings' && 'Bookings'}
            {activeView === 'notifications' && 'Notifications'}
          </h1>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">CampEdge</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  setActiveView('dashboard')
                  setIsSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                  activeView === 'dashboard' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                )}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveView('bookings')
                  setIsSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                  activeView === 'bookings' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                )}
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5" />
                <span>Customers</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors">
                <DollarSign className="w-5 h-5" />
                <span>Revenue</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors">
                <Star className="w-5 h-5" />
                <span>Reviews</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={cn(
              "flex flex-col items-center p-3 transition-colors",
              activeView === 'dashboard' ? "text-blue-600" : "text-gray-600"
            )}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveView('bookings')}
            className={cn(
              "flex flex-col items-center p-3 transition-colors",
              activeView === 'bookings' ? "text-blue-600" : "text-gray-600"
            )}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Bookings</span>
          </button>
          
          <button className="flex flex-col items-center p-3 text-gray-600">
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-xs">Analytics</span>
          </button>
          
          <button className="flex flex-col items-center p-3 text-gray-600">
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20" />
    </div>
  )
}

export default MobileOptimizedDashboard
