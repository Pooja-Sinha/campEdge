import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '../types/index'
import authMockData from '../data/auth_mock_data.json'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// Mock API functions
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock user data based on email
  const mockUsers: Record<string, User> = authMockData.users as Record<string, User>
  
  const user = mockUsers[email]
  if (!user || password !== authMockData.defaultPassword) {
    console.log('Invalid email or password (authStore): email: ', email, 'password: ', password)
    throw new Error('Invalid email or password')
  }
  
  return user
}

const mockSignup = async (userData: any): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Check if email already exists
  if (userData.email === 'user@campindia.com' || 
      userData.email === 'organizer@campindia.com' || 
      userData.email === 'admin@campindia.com') {
    throw new Error('Email already exists')
  }
  
  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    role: userData.role || 'user',
    verified: false,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=059669&color=fff`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return newUser
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const user = await mockLogin(email, password)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          })
          throw error
        }
      },

      signup: async (userData: any) => {
        set({ isLoading: true, error: null })
        
        try {
          const user = await mockSignup(userData)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false 
          })
          throw error
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        })
      },

      updateProfile: async (userData: Partial<User>) => {
        const { user } = get()
        if (!user) throw new Error('No user logged in')
        
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const updatedUser = {
            ...user,
            ...userData,
            updatedAt: new Date().toISOString()
          }
          
          set({ 
            user: updatedUser, 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Profile update failed',
            isLoading: false 
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
