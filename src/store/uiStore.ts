import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface Modal {
  id: string
  component: React.ComponentType<any>
  props?: any
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
}

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Navigation
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  
  // Modals
  modals: Modal[]
  
  // Notifications
  notifications: Notification[]
  
  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Offline state
  isOnline: boolean
  
  // PWA
  showInstallPrompt: boolean
  isInstalled: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (open: boolean) => void
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
  
  // Network actions
  setOnlineStatus: (online: boolean) => void
  
  // PWA actions
  setShowInstallPrompt: (show: boolean) => void
  setIsInstalled: (installed: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      isMobileMenuOpen: false,
      isSearchOpen: false,
      modals: [],
      notifications: [],
      globalLoading: false,
      loadingStates: {},
      isOnline: navigator.onLine,
      showInstallPrompt: false,
      isInstalled: false,

      // Theme actions
      setTheme: (theme) => {
        set({ theme })
        
        // Apply theme to document
        const root = document.documentElement
        if (theme === 'dark') {
          root.classList.add('dark')
        } else if (theme === 'light') {
          root.classList.remove('dark')
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (prefersDark) {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      },

      // Navigation actions
      toggleMobileMenu: () => {
        set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }))
      },

      setMobileMenuOpen: (open) => {
        set({ isMobileMenuOpen: open })
      },

      toggleSearch: () => {
        set(state => ({ isSearchOpen: !state.isSearchOpen }))
      },

      setSearchOpen: (open) => {
        set({ isSearchOpen: open })
      },

      // Modal actions
      openModal: (modal) => {
        const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newModal = { ...modal, id }
        
        set(state => ({
          modals: [...state.modals, newModal]
        }))
        
        return id
      },

      closeModal: (id) => {
        set(state => ({
          modals: state.modals.filter(modal => modal.id !== id)
        }))
      },

      closeAllModals: () => {
        set({ modals: [] })
      },

      // Notification actions
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newNotification = { 
          ...notification, 
          id,
          duration: notification.duration || 5000
        }
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Auto-remove notification after duration
        if (newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, newNotification.duration)
        }
        
        return id
      },

      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // Loading actions
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading })
      },

      setLoading: (key, loading) => {
        set(state => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading
          }
        }))
      },

      isLoading: (key) => {
        return get().loadingStates[key] || false
      },

      // Network actions
      setOnlineStatus: (online) => {
        set({ isOnline: online })
        
        // Show notification when going offline/online
        if (online) {
          get().addNotification({
            type: 'success',
            title: 'Back Online',
            message: 'Your internet connection has been restored.',
            duration: 3000
          })
        } else {
          get().addNotification({
            type: 'warning',
            title: 'You\'re Offline',
            message: 'Some features may be limited while offline.',
            duration: 5000
          })
        }
      },

      // PWA actions
      setShowInstallPrompt: (show) => {
        set({ showInstallPrompt: show })
      },

      setIsInstalled: (installed) => {
        set({ isInstalled: installed })
      },
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme,
        isInstalled: state.isInstalled
      }),
    }
  )
)

// Initialize theme on store creation
const initializeTheme = () => {
  const { theme, setTheme } = useUIStore.getState()
  setTheme(theme)
}

// Initialize online status listener
const initializeOnlineListener = () => {
  const { setOnlineStatus } = useUIStore.getState()
  
  const handleOnline = () => setOnlineStatus(true)
  const handleOffline = () => setOnlineStatus(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

// Initialize system theme listener
const initializeSystemThemeListener = () => {
  const { theme, setTheme } = useUIStore.getState()
  
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (useUIStore.getState().theme === 'system') {
        setTheme('system') // This will re-apply the system theme
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  initializeTheme()
  initializeOnlineListener()
  initializeSystemThemeListener()
}
