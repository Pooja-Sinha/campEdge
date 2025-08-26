import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'

export const useAuthZustand = () => {
  const { 
    login: loginStore, 
    signup: signupStore, 
    logout: logoutStore, 
    updateProfile: updateProfileStore,
    isLoading,
    error,
    clearError
  } = useAuthStore()
  const { addNotification } = useUIStore()

  const login = {
    mutateAsync: async (credentials: { email: string; password: string }) => {
      try {
        await loginStore(credentials.email, credentials.password)
        addNotification({
          type: 'success',
          title: 'Welcome back!',
          message: 'You have successfully logged in.',
        })
        return { success: true }
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Login Failed',
          message: error instanceof Error ? error.message : 'Please try again.',
        })
        throw error
      }
    },
    isLoading,
    error
  }

  const signup = {
    mutateAsync: async (userData: any) => {
      try {
        await signupStore(userData)
        addNotification({
          type: 'success',
          title: 'Account Created!',
          message: 'Welcome to CampIndia! Your account has been created successfully.',
        })
        return { success: true }
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Signup Failed',
          message: error instanceof Error ? error.message : 'Please try again.',
        })
        throw error
      }
    },
    isLoading,
    error
  }

  const logout = {
    mutateAsync: async () => {
      logoutStore()
      addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
      })
      return { success: true }
    }
  }

  const updateProfile = {
    mutateAsync: async (userData: any) => {
      try {
        await updateProfileStore(userData)
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
        })
        return { success: true }
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: error instanceof Error ? error.message : 'Please try again.',
        })
        throw error
      }
    },
    isLoading,
    error
  }

  return {
    login,
    signup,
    logout,
    updateProfile,
    clearError
  }
}

export const useIsAuthenticatedZustand = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  return {
    isAuthenticated,
    user,
    isLoading,
  }
}

// Hook to check user role with Zustand
export const useUserRoleZustand = () => {
  const { user } = useAuthStore()

  const isAdmin = user?.role === 'admin'
  const isOwner = user?.role === 'owner'
  const isOrganizer = user?.role === 'organizer'
  const isUser = user?.role === 'user'

  return {
    role: user?.role,
    isAdmin,
    isOwner,
    isOrganizer,
    isUser,
  }
}

// Hook for protected routes with Zustand
export const useRequireAuthZustand = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore()

  return {
    isAuthenticated,
    isLoading,
    user,
    requireAuth: !isLoading && !isAuthenticated,
  }
}

// Hook for role-based access control with Zustand
export const useRequireRoleZustand = (requiredRoles: string[]) => {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  const hasRequiredRole = user && requiredRoles.includes(user.role)
  const accessDenied = !isLoading && isAuthenticated && !hasRequiredRole

  return {
    hasAccess: hasRequiredRole,
    accessDenied,
    isLoading,
    user,
  }
}
