import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'
import { useUIStore } from './store/uiStore'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const CampsPage = lazy(() => import('./pages/CampsPage'))
const CampDetailPage = lazy(() => import('./pages/CampDetailPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
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

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
