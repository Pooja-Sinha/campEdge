import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '../types/index'

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
  const mockUsers: Record<string, User> = {
    'user@campindia.com': {
      id: 'user-001',
      name: 'John Doe',
      email: 'user@campindia.com',
      phone: '+91-9876543210',
      role: 'user',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Mumbai, Maharashtra',
      bio: 'Adventure enthusiast and photographer',
      createdAt: '2022-01-15T10:00:00Z',
      updatedAt: '2024-11-15T14:30:00Z'
    },
    'organizer@campindia.com': {
      id: 'org-001',
      name: 'Adventure Guide',
      email: 'organizer@campindia.com',
      phone: '+91-9876543211',
      role: 'organizer',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Manali, Himachal Pradesh',
      bio: 'Professional mountain guide with 10+ years experience',
      createdAt: '2019-05-20T10:00:00Z',
      updatedAt: '2024-11-13T15:20:00Z'
    },
    'admin@campindia.com': {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@campindia.com',
      phone: '+91-9876543212',
      role: 'admin',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      location: 'Bangalore, Karnataka',
      bio: 'CampIndia platform administrator',
      createdAt: '2020-01-01T10:00:00Z',
      updatedAt: '2024-11-15T10:00:00Z'
    }
  }
  
  const user = mockUsers[email]
  if (!user || password !== 'password123') {
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
