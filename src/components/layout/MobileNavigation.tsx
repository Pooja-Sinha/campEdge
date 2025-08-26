import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Menu,
  X,
  Mountain,
  MapPin,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Bell
} from 'lucide-react'
import { useIsAuthenticated, useAuth } from '../../hooks/useAuth'
import { useUIStore } from '../../store/uiStore'
import { useTouchGestures } from '../../hooks/useTouchGestures'
import { cn } from '../../utils/cn'

const MobileNavigation = () => {
  const location = useLocation()
  const { isAuthenticated, user } = useIsAuthenticated()
  const { logout } = useAuth()
  const { isMobileMenuOpen, setMobileMenuOpen, theme, setTheme } = useUIStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setShowProfileMenu(false)
  }, [location.pathname, setMobileMenuOpen])

  // Touch gestures for swipe to close menu
  const { attachListeners } = useTouchGestures({
    onSwipe: (gesture) => {
      if (gesture.direction === 'left' && isMobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
  }, {
    swipeThreshold: 100
  })

  const bottomNavItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      exact: true
    },
    { 
      path: '/camps', 
      icon: Search, 
      label: 'Explore'
    },
    { 
      path: '/wishlist', 
      icon: Heart, 
      label: 'Wishlist',
      requireAuth: true
    },
    { 
      path: isAuthenticated ? '/profile' : '/login', 
      icon: User, 
      label: isAuthenticated ? 'Profile' : 'Login'
    }
  ]

  const sideMenuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/camps', icon: MapPin, label: 'All Camps' },
    { path: '/blog', icon: MessageSquare, label: 'Blog' },
    ...(isAuthenticated ? [
      { path: '/profile', icon: User, label: 'My Profile' },
      { path: '/bookings', icon: Calendar, label: 'My Bookings' },
      { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    ] : [
      { path: '/login', icon: User, label: 'Sign In' },
      { path: '/signup', icon: User, label: 'Sign Up' },
    ])
  ]

  const isActiveRoute = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CampIndia
            </span>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {isAuthenticated && (
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>
            )}

            {/* Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Side Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        ref={(el) => {
          if (el && isMobileMenuOpen) {
            const cleanup = attachListeners(el)
            return cleanup
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to CampIndia
                </div>
                <div className="space-x-3">
                  <Link
                    to="/login"
                    className="btn-primary text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-secondary text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-4">
              {sideMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActiveRoute(item.path)
                      ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Theme: {theme}</span>
            </button>

            {/* Logout */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 h-16">
          {bottomNavItems.map((item) => {
            if (item.requireAuth && !isAuthenticated) return null
            
            const isActive = isActiveRoute(item.path, item.exact)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors",
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="lg:hidden h-16 pt-16" />
    </>
  )
}

export default MobileNavigation
