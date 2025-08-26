import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/api';
import type { User } from '../types/index';

// Query keys
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: () => userApi.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: false, // Don't retry auth queries
  });
};

// Hook for authentication actions
export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      userApi.login(email, password),
    onSuccess: (response) => {
      if (response.success) {
        // Update the user query cache
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, response);
        // Invalidate all user-related queries
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
  });

  const logout = useMutation({
    mutationFn: () => userApi.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Set user to null
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, {
        success: true,
        data: null,
      });
    },
  });

  const updateProfile = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<User> }) =>
      userApi.updateProfile(userId, updates),
    onSuccess: (response) => {
      if (response.success) {
        // Update the user query cache
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, response);
      }
    },
  });

  return {
    login,
    logout,
    updateProfile,
  };
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: userResponse, isLoading } = useCurrentUser();

  const isAuthenticated = userResponse?.success && userResponse.data !== null;
  const user = userResponse?.success ? userResponse.data : null;

  return {
    isAuthenticated,
    user,
    isLoading,
  };
};

// Hook to check user role
export const useUserRole = () => {
  const { user } = useIsAuthenticated();

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const isOrganizer = user?.role === 'organizer';
  const isUser = user?.role === 'user';

  return {
    role: user?.role,
    isAdmin,
    isOwner,
    isOrganizer,
    isUser,
  };
};

// Hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  return {
    isAuthenticated,
    isLoading,
    user,
    requireAuth: !isLoading && !isAuthenticated,
  };
};

// Hook for role-based access control
export const useRequireRole = (requiredRoles: string[]) => {
  const { user, isAuthenticated, isLoading } = useIsAuthenticated();

  const hasRequiredRole = user && requiredRoles.includes(user.role);
  const accessDenied = !isLoading && isAuthenticated && !hasRequiredRole;

  return {
    hasAccess: hasRequiredRole,
    accessDenied,
    isLoading,
    user,
  };
};
