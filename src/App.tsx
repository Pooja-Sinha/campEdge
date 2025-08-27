import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'
import Layout from './components/layout/Layout'
import { useUIStore } from './store/uiStore'

// Lazy load pages for better performance
const HomePage = lazy(async () => import('./pages/HomePage'))
const CampsPage = lazy(async () => import('./pages/CampsPage'))
const CampDetailPage = lazy(async () => import('./pages/CampDetailPage'))
const BookingPage = lazy(async () => import('./pages/BookingPage'))
const ProfilePage = lazy(async () => import('./pages/ProfilePage'))
const WishlistPage = lazy(async () => import('./pages/WishlistPage'))
const BlogPage = lazy(async () => import('./pages/BlogPage'))
const BlogPostPage = lazy(async () => import('./pages/BlogPostPage'))
const LoginPage = lazy(async () => import('./pages/LoginPage'))
const SignupPage = lazy(async () => import('./pages/SignupPage'))
const AdminDashboard = lazy(async () => import('./pages/admin/AdminDashboard'))
const OrganizerDashboard = lazy(async () => import('./pages/organizer/OrganizerDashboard'))
const NotFoundPage = lazy(async () => import('./pages/NotFoundPage'))

const App = () => {
  const { theme, setTheme } = useUIStore()

  // Ensure theme is properly applied on app initialization
  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/camps" element={<CampsPage />} />
            <Route path="/camps/:id" element={<CampDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/booking/:campId" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Organizer Routes */}
            <Route path="/organizer/*" element={<OrganizerDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
