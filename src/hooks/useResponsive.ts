import { useState, useEffect } from 'react'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    orientation: 'landscape'
  })

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height,
        orientation: height > width ? 'portrait' : 'landscape'
      })
    }

    // Initial update
    updateState()

    // Add event listeners
    window.addEventListener('resize', updateState)
    window.addEventListener('orientationchange', updateState)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateState)
      window.removeEventListener('orientationchange', updateState)
    }
  }, [])

  return state
}

// Hook for detecting touch devices
export const useTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouchDevice()
  }, [])

  return isTouchDevice
}

// Hook for detecting device type
export const useDeviceType = () => {
  const responsive = useResponsive()
  const isTouch = useTouchDevice()

  const deviceType = (() => {
    if (responsive.isMobile) return 'mobile'
    if (responsive.isTablet) return 'tablet'
    return 'desktop'
  })()

  const isMobileDevice = deviceType === 'mobile' || (deviceType === 'tablet' && isTouch)

  return {
    deviceType,
    isMobileDevice,
    isTouch,
    ...responsive
  }
}

// Hook for responsive breakpoints
export const useBreakpoint = () => {
  const { width } = useResponsive()

  return {
    xs: width >= 0,
    sm: width >= 640,
    md: width >= 768,
    lg: width >= 1024,
    xl: width >= 1280,
    '2xl': width >= 1536,
    current: (() => {
      if (width >= 1536) return '2xl'
      if (width >= 1280) return 'xl'
      if (width >= 1024) return 'lg'
      if (width >= 768) return 'md'
      if (width >= 640) return 'sm'
      return 'xs'
    })()
  }
}

// Hook for mobile-first responsive design
export const useMobileFirst = () => {
  const responsive = useResponsive()
  const touch = useTouchDevice()

  // Mobile-optimized settings
  const mobileSettings = {
    showSidebar: false,
    compactMode: true,
    touchOptimized: true,
    reducedAnimations: true,
    largerTouchTargets: true
  }

  // Desktop settings
  const desktopSettings = {
    showSidebar: true,
    compactMode: false,
    touchOptimized: false,
    reducedAnimations: false,
    largerTouchTargets: false
  }

  const settings = responsive.isMobile || touch ? mobileSettings : desktopSettings

  return {
    ...responsive,
    isTouch: touch,
    settings,
    // Utility functions
    shouldUseMobileLayout: () => responsive.isMobile || (responsive.isTablet && touch),
    shouldShowBottomNav: () => responsive.isMobile,
    shouldCompactHeader: () => responsive.isMobile || responsive.isTablet,
    getOptimalColumns: () => {
      if (responsive.isMobile) return 1
      if (responsive.isTablet) return 2
      return responsive.width > 1400 ? 4 : 3
    },
    getCardSize: () => {
      if (responsive.isMobile) return 'small'
      if (responsive.isTablet) return 'medium'
      return 'large'
    }
  }
}

// Hook for PWA features
export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      setIsInstalled(
        window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-ignore
        window.navigator.standalone === true
      )
    }

    checkInstalled()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Error installing app:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    installApp,
    canInstall: isInstallable && !isInstalled
  }
}

// Hook for offline detection
export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}

// Hook for mobile gestures
export const useMobileGestures = () => {
  const [gesture, setGesture] = useState<{
    type: 'swipe' | 'pinch' | 'tap' | null
    direction?: 'left' | 'right' | 'up' | 'down'
    distance?: number
  }>({ type: null })

  useEffect(() => {
    let startX = 0
    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && e.touches[0]) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        startTime = Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1 && e.changedTouches[0]) {
        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY
        const endTime = Date.now()
        
        const deltaX = endX - startX
        const deltaY = endY - startY
        const deltaTime = endTime - startTime
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // Detect tap
        if (distance < 10 && deltaTime < 300) {
          setGesture({ type: 'tap' })
          return
        }

        // Detect swipe
        if (distance > 50 && deltaTime < 500) {
          const direction = Math.abs(deltaX) > Math.abs(deltaY)
            ? (deltaX > 0 ? 'right' : 'left')
            : (deltaY > 0 ? 'down' : 'up')
          
          setGesture({ type: 'swipe', direction, distance })
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return gesture
}

export default useResponsive
