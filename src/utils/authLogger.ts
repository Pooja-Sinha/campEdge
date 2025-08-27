/**
 * Authentication Logger Utility
 * Provides comprehensive logging for authentication events across all platforms and roles
 */

export interface LogoutEvent {
  userId?: string
  userEmail?: string
  userRole?: string
  platform: 'web' | 'mobile'
  component: string
  timestamp: string
  success: boolean
  error?: string
  sessionDuration?: number
  userAgent?: string
  location?: string
}

export interface LoginEvent {
  userId?: string
  userEmail?: string
  userRole?: string
  platform: 'web' | 'mobile'
  timestamp: string
  success: boolean
  error?: string
  userAgent?: string
  location?: string
}

class AuthLogger {
  private static instance: AuthLogger
  private logs: (LogoutEvent | LoginEvent)[] = []

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger()
    }
    return AuthLogger.instance
  }

  /**
   * Detect if the user is on mobile based on screen size and user agent
   */
  private detectPlatform(): 'web' | 'mobile' {
    // Check screen size
    const isMobileScreen = window.innerWidth < 768
    
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/iu.test(userAgent)
    
    return isMobileScreen || isMobileUA ? 'mobile' : 'web'
  }

  /**
   * Get current location (pathname)
   */
  private getCurrentLocation(): string {
    return window.location.pathname
  }

  /**
   * Calculate session duration if login timestamp is available
   */
  private calculateSessionDuration(loginTimestamp?: string): number | undefined {
    if (!loginTimestamp) {
      return undefined
    }
    
    const loginTime = new Date(loginTimestamp).getTime()
    const currentTime = new Date().getTime()
    return Math.round((currentTime - loginTime) / 1000) // Duration in seconds
  }

  /**
   * Log logout event with comprehensive details
   */
  public logLogout(params: {
    user?: {
      id?: string
      email?: string
      role?: string
      loginTimestamp?: string
    }
    component: string
    success: boolean
    error?: string
  }): void {
    const logEvent: LogoutEvent = {
      userId: params.user?.id,
      userEmail: params.user?.email,
      userRole: params.user?.role,
      platform: this.detectPlatform(),
      component: params.component,
      timestamp: new Date().toISOString(),
      success: params.success,
      error: params.error,
      sessionDuration: this.calculateSessionDuration(params.user?.loginTimestamp),
      userAgent: navigator.userAgent,
      location: this.getCurrentLocation()
    }

    // Add to internal logs
    this.logs.push(logEvent)

    // Console log for development
    if (import.meta.env.DEV) {
      console.group(`🚪 LOGOUT EVENT - ${params.success ? 'SUCCESS' : 'FAILED'}`)
      console.log('📱 Platform:', logEvent.platform)
      console.log('🧩 Component:', logEvent.component)
      console.log('👤 User:', logEvent.userEmail || 'Unknown')
      console.log('🎭 Role:', logEvent.userRole || 'Unknown')
      console.log('⏱️ Session Duration:', logEvent.sessionDuration ? `${logEvent.sessionDuration}s` : 'Unknown')
      console.log('📍 Location:', logEvent.location)
      if (logEvent.error) {
        console.error('❌ Error:', logEvent.error)
      }
      console.log('🕐 Timestamp:', logEvent.timestamp)
      console.groupEnd()
    }

    // Send to analytics service (in production)
    this.sendToAnalytics(logEvent)
  }

  /**
   * Log login event with comprehensive details
   */
  public logLogin(params: {
    user?: {
      id?: string
      email?: string
      role?: string
    }
    success: boolean
    error?: string
  }): void {
    const logEvent: LoginEvent = {
      userId: params.user?.id,
      userEmail: params.user?.email,
      userRole: params.user?.role,
      platform: this.detectPlatform(),
      timestamp: new Date().toISOString(),
      success: params.success,
      error: params.error,
      userAgent: navigator.userAgent,
      location: this.getCurrentLocation()
    }

    // Add to internal logs
    this.logs.push(logEvent)

    // Console log for development
    if (import.meta.env.DEV) {
      console.group(`🚪 LOGIN EVENT - ${params.success ? 'SUCCESS' : 'FAILED'}`)
      console.log('📱 Platform:', logEvent.platform)
      console.log('👤 User:', logEvent.userEmail || 'Unknown')
      console.log('🎭 Role:', logEvent.userRole || 'Unknown')
      console.log('📍 Location:', logEvent.location)
      if (logEvent.error) {
        console.error('❌ Error:', logEvent.error)
      }
      console.log('🕐 Timestamp:', logEvent.timestamp)
      console.groupEnd()
    }

    // Send to analytics service (in production)
    this.sendToAnalytics(logEvent)
  }

  /**
   * Send event to analytics service
   */
  private sendToAnalytics(event: LogoutEvent | LoginEvent): void {
    // In production, this would send to your analytics service
    // For now, we'll just store it locally
    try {
      const existingLogs = localStorage.getItem('auth_logs')
      const logs = existingLogs ? JSON.parse(existingLogs) : []
      logs.push(event)
      
      // Keep only last 100 logs to prevent storage bloat
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100)
      }
      
      localStorage.setItem('auth_logs', JSON.stringify(logs))
    } catch (error) {
      console.warn('Failed to store auth log:', error)
    }
  }

  /**
   * Get all logs (for debugging/admin purposes)
   */
  public getLogs(): (LogoutEvent | LoginEvent)[] {
    return [...this.logs]
  }

  /**
   * Get logs from localStorage
   */
  public getStoredLogs(): (LogoutEvent | LoginEvent)[] {
    try {
      const storedLogs = localStorage.getItem('auth_logs')
      return storedLogs ? JSON.parse(storedLogs) : []
    } catch {
      return []
    }
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = []
    localStorage.removeItem('auth_logs')
  }
}

// Export singleton instance
export const authLogger = AuthLogger.getInstance()

// Convenience functions
export const logLogout = (params: Parameters<typeof authLogger.logLogout>[0]) => {
  authLogger.logLogout(params)
}

export const logLogin = (params: Parameters<typeof authLogger.logLogin>[0]) => {
  authLogger.logLogin(params)
}
