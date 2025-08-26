import type {
  Camp,
  User,
  Review,
  Booking,
  WishlistItem,
  BlogPost,
  Notification,
  SearchFilters,
  SearchResult,
  ApiResponse,
  PaginatedResponse
} from '../types/index';

// Import mock data
import campingData from '../data/camping_mock_data.json';
import additionalData from '../data/additional_mock_data.json';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'camping_users',
  BOOKINGS: 'camping_bookings',
  REVIEWS: 'camping_reviews',
  WISHLIST: 'camping_wishlist',
  NOTIFICATIONS: 'camping_notifications',
  CURRENT_USER: 'camping_current_user'
};

// Initialize local storage with mock data if not exists
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(additionalData.users));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(additionalData.bookings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(additionalData.reviews));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(additionalData.wishlist));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(additionalData.notifications));
  }
};

// Force re-initialization to include demo users
const forceReinitializeStorage = () => {
  console.log('Force re-initializing storage with updated demo users...');
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(additionalData.users));
  console.log('Storage re-initialized with', additionalData.users.length, 'users');
  console.log('Demo users now available:', additionalData.users.filter(u => u.email.includes('campindia.com')).map(u => u.email));
};

// Initialize storage on module load
initializeStorage();

// Force re-initialization to include the new demo users
forceReinitializeStorage();

// Helper functions
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Camp API
export const campApi = {
  // Get all camps with optional filters
  getCamps: async (filters?: SearchFilters, page = 1, limit = 10): Promise<SearchResult> => {
    await delay();
    
    let camps = [...campingData.camps] as Camp[];
    
    // Apply filters
    if (filters) {
      if (filters.location) {
        camps = camps.filter(camp => 
          camp.location.name.toLowerCase().includes(filters.location!.toLowerCase()) ||
          camp.location.state.toLowerCase().includes(filters.location!.toLowerCase()) ||
          camp.location.nearestCity.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.priceRange) {
        camps = camps.filter(camp => 
          camp.pricing.basePrice >= filters.priceRange!.min &&
          camp.pricing.basePrice <= filters.priceRange!.max
        );
      }
      
      if (filters.difficulty && filters.difficulty.length > 0) {
        camps = camps.filter(camp => filters.difficulty!.includes(camp.difficulty));
      }
      
      if (filters.groupSize) {
        camps = camps.filter(camp => 
          camp.groupSize.min <= filters.groupSize! &&
          camp.groupSize.max >= filters.groupSize!
        );
      }
      
      if (filters.duration) {
        camps = camps.filter(camp => 
          camp.duration.days >= filters.duration!.min &&
          camp.duration.days <= filters.duration!.max
        );
      }
      
      if (filters.rating) {
        camps = camps.filter(camp => camp.rating.average >= filters.rating!);
      }
      
      if (filters.verified !== undefined) {
        camps = camps.filter(camp => camp.verified === filters.verified);
      }
      
      if (filters.activities && filters.activities.length > 0) {
        camps = camps.filter(camp => 
          camp.activities.some(activity => 
            filters.activities!.some(filterActivity => 
              activity.name.toLowerCase().includes(filterActivity.toLowerCase())
            )
          )
        );
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        camps = camps.filter(camp => 
          camp.amenities.some(amenity => 
            filters.amenities!.some(filterAmenity => 
              amenity.name.toLowerCase().includes(filterAmenity.toLowerCase())
            )
          )
        );
      }
      
      if (filters.season && filters.season.length > 0) {
        camps = camps.filter(camp => 
          camp.bestTimeToVisit.some(season => filters.season!.includes(season))
        );
      }
    }
    
    // Pagination
    const total = camps.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCamps = camps.slice(startIndex, endIndex);
    
    return {
      camps: paginatedCamps,
      total,
      page,
      limit,
      filters: filters || {}
    };
  },

  // Get camp by ID
  getCampById: async (id: string): Promise<ApiResponse<Camp>> => {
    await delay();
    
    const camp = campingData.camps.find(c => c.id === id);
    
    if (!camp) {
      return {
        success: false,
        data: null,
        error: 'Camp not found'
      };
    }
    
    return {
      success: true,
      data: camp as Camp
    };
  },

  // Get featured camps
  getFeaturedCamps: async (): Promise<ApiResponse<Camp[]>> => {
    await delay();
    
    const featuredCamps = campingData.camps.filter(camp => camp.featured);
    
    return {
      success: true,
      data: featuredCamps as Camp[]
    };
  },

  // Search camps
  searchCamps: async (query: string): Promise<ApiResponse<Camp[]>> => {
    await delay();
    
    const searchResults = campingData.camps.filter(camp => 
      camp.title.toLowerCase().includes(query.toLowerCase()) ||
      camp.description.toLowerCase().includes(query.toLowerCase()) ||
      camp.location.name.toLowerCase().includes(query.toLowerCase()) ||
      camp.location.state.toLowerCase().includes(query.toLowerCase()) ||
      camp.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    return {
      success: true,
      data: searchResults as Camp[]
    };
  }
};

// User API
export const userApi = {
  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User | null>> => {
    await delay();
    
    const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUserId) {
      return {
        success: true,
        data: null
      };
    }
    
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === currentUserId);
    
    return {
      success: true,
      data: user || null
    };
  },

  // Login user (mock)
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    await delay();

    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    console.log('Available users in storage:', users.map(u => u.email));
    console.log('Looking for email:', email);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return {
        success: false,
        data: null,
        error: 'User not found'
      };
    }
    
    // Mock password validation (in real app, this would be handled by backend)
    if (password !== 'password123') {
      return {
        success: false,
        data: null,
        error: 'Invalid password'
      };
    }
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.id);
    
    return {
      success: true,
      data: user
    };
  },

  // Logout user
  logout: async (): Promise<ApiResponse<boolean>> => {
    await delay();
    
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    return {
      success: true,
      data: true
    };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<User>): Promise<ApiResponse<User>> => {
    await delay();
    
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        data: null,
        error: 'User not found'
      };
    }
    
    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.USERS, users);
    
    return {
      success: true,
      data: users[userIndex]
    };
  }
};

// Review API
export const reviewApi = {
  // Get reviews for a camp
  getCampReviews: async (campId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> => {
    await delay();
    
    const reviews = getFromStorage<Review>(STORAGE_KEYS.REVIEWS);
    const campReviews = reviews.filter(r => r.campId === campId);
    
    const total = campReviews.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = campReviews.slice(startIndex, endIndex);
    
    return {
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Add a review
  addReview: async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Review>> => {
    await delay();
    
    const reviews = getFromStorage<Review>(STORAGE_KEYS.REVIEWS);
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
    
    return {
      success: true,
      data: newReview
    };
  }
};

// Booking API
export const bookingApi = {
  // Get user bookings
  getUserBookings: async (userId: string): Promise<ApiResponse<Booking[]>> => {
    await delay();
    
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    const userBookings = bookings.filter(b => b.userId === userId);
    
    return {
      success: true,
      data: userBookings
    };
  },

  // Create booking
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>> => {
    await delay();
    
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    
    return {
      success: true,
      data: newBooking
    };
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    await delay();
    
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return {
        success: false,
        data: null,
        error: 'Booking not found'
      };
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      bookingStatus: 'cancelled',
      updatedAt: new Date().toISOString()
    };
    
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    
    return {
      success: true,
      data: bookings[bookingIndex]
    };
  }
};

// Wishlist API
export const wishlistApi = {
  // Get user wishlist
  getUserWishlist: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
    await delay();
    
    const wishlist = getFromStorage<WishlistItem>(STORAGE_KEYS.WISHLIST);
    const userWishlist = wishlist.filter(w => w.userId === userId);
    
    return {
      success: true,
      data: userWishlist
    };
  },

  // Add to wishlist
  addToWishlist: async (userId: string, campId: string, notes?: string): Promise<ApiResponse<WishlistItem>> => {
    await delay();
    
    const wishlist = getFromStorage<WishlistItem>(STORAGE_KEYS.WISHLIST);
    
    // Check if already in wishlist
    const existingItem = wishlist.find(w => w.userId === userId && w.campId === campId);
    if (existingItem) {
      return {
        success: false,
        data: null,
        error: 'Camp already in wishlist'
      };
    }
    
    const newWishlistItem: WishlistItem = {
      id: `wishlist-${Date.now()}`,
      userId,
      campId,
      addedAt: new Date().toISOString(),
      notes
    };
    
    wishlist.push(newWishlistItem);
    saveToStorage(STORAGE_KEYS.WISHLIST, wishlist);
    
    return {
      success: true,
      data: newWishlistItem
    };
  },

  // Remove from wishlist
  removeFromWishlist: async (userId: string, campId: string): Promise<ApiResponse<boolean>> => {
    await delay();
    
    const wishlist = getFromStorage<WishlistItem>(STORAGE_KEYS.WISHLIST);
    const filteredWishlist = wishlist.filter(w => !(w.userId === userId && w.campId === campId));
    
    saveToStorage(STORAGE_KEYS.WISHLIST, filteredWishlist);
    
    return {
      success: true,
      data: true
    };
  }
};

// Blog API
export const blogApi = {
  // Get blog posts
  getBlogPosts: async (page = 1, limit = 10, category?: string): Promise<PaginatedResponse<BlogPost>> => {
    await delay();
    
    let posts = [...additionalData.blogPosts] as BlogPost[];
    
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    
    // Filter only published posts
    posts = posts.filter(post => post.published);
    
    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
    
    const total = posts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    return {
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Get blog post by slug
  getBlogPostBySlug: async (slug: string): Promise<ApiResponse<BlogPost>> => {
    await delay();
    
    const post = additionalData.blogPosts.find(p => p.slug === slug && p.published);
    
    if (!post) {
      return {
        success: false,
        data: null,
        error: 'Blog post not found'
      };
    }
    
    return {
      success: true,
      data: post as BlogPost
    };
  }
};

// Notification API
export const notificationApi = {
  // Get user notifications
  getUserNotifications: async (userId: string): Promise<ApiResponse<Notification[]>> => {
    await delay();
    
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const userNotifications = notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      data: userNotifications
    };
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<ApiResponse<boolean>> => {
    await delay();
    
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex !== -1) {
      notifications[notificationIndex].read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
    
    return {
      success: true,
      data: true
    };
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<ApiResponse<boolean>> => {
    await delay();
    
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const updatedNotifications = notifications.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    );
    
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
    
    return {
      success: true,
      data: true
    };
  }
};
