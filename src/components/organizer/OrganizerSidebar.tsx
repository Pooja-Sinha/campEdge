import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  MapPin,
  MessageSquare,
  Shield,
  Star,
  Users,
  Image,LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  CalendarDays,
  Brain,
  Zap} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useIsAuthenticated } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'
import { logLogout } from '../../utils/authLogger'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  badge?: number
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    path: '/organizer'
  },
  {
    id: 'camps',
    label: 'Camp Management',
    icon: MapPin,
    path: '/organizer/camps'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    path: '/organizer/bookings',
    badge: 5 // Mock pending bookings
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/organizer/analytics'
  },
  {
    id: 'financial',
    label: 'Financial',
    icon: CreditCard,
    path: '/organizer/financial'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    path: '/organizer/customers'
  },
  {
    id: 'content',
    label: 'Content',
    icon: Image,
    path: '/organizer/content'
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: Star,
    path: '/organizer/reviews',
    badge: 3 // Mock pending reviews
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    path: '/organizer/communication'
  },
  {
    id: 'safety',
    label: 'Safety & Compliance',
    icon: Shield,
    path: '/organizer/safety'
  },
  {
    id: 'availability',
    label: 'Availability',
    icon: CalendarDays,
    path: '/organizer/availability'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/organizer/profile'
  },
  {
    id: 'pricing',
    label: 'Advanced Pricing',
    icon: DollarSign,
    path: '/organizer/pricing'
  },
  {
    id: 'advanced-analytics',
    label: 'AI Analytics',
    icon: Brain,
    path: '/organizer/advanced-analytics'
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: Zap,
    path: '/organizer/automation'
  }
]

const OrganizerSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user } = useIsAuthenticated()

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()

      // Log successful logout
      logLogout({
        user: {
          id: user?.id,
          email: user?.email,
          role: user?.role,
          loginTimestamp: user?.createdAt
        },
        component: 'OrganizerSidebar.tsx - Sidebar Footer',
        success: true
      })

      navigate('/')
    } catch (error) {
      // Log failed logout
      logLogout({
        user: {
          id: user?.id,
          email: user?.email,
          role: user?.role,
          loginTimestamp: user?.createdAt
        },
        component: 'OrganizerSidebar.tsx - Sidebar Footer',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300",
        "lg:translate-x-0", // Always visible on desktop
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", // Hidden on mobile unless menu is open
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Organizer Panel
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your camps
                </p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/organizer' && location.pathname.startsWith(item.path))

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { handleLogout().catch(() => {}) }}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
              "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default OrganizerSidebar
