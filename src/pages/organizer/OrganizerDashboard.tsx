import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserRole } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import OrganizerSidebar from '../../components/organizer/OrganizerSidebar'
import OrganizerOverview from './OrganizerOverview'
import CampManagement from './CampManagement'
import BookingManagement from './BookingManagement'
import Analytics from './Analytics'
import FinancialManagement from './FinancialManagement'
import CustomerManagement from './CustomerManagement'
import ContentManagement from './ContentManagement'
import ReviewManagement from './ReviewManagement'
import CommunicationTools from './CommunicationTools'
import SafetyCompliance from './SafetyCompliance'
import OrganizerProfile from './OrganizerProfile'
import AvailabilityCalendar from './AvailabilityCalendar'
import AdvancedPricing from './AdvancedPricing'
import AdvancedAnalytics from './AdvancedAnalytics'
import AutomationTools from './AutomationTools'
import OrganizerOnboarding from './OrganizerOnboarding'

const OrganizerDashboard = () => {
  const { isOrganizer, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (!isOrganizer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need organizer privileges to access this dashboard.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <OrganizerSidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="p-4 lg:p-6">
            <Routes>
              <Route index element={<OrganizerOverview />} />
              <Route path="camps/*" element={<CampManagement />} />
              <Route path="bookings/*" element={<BookingManagement />} />
              <Route path="analytics/*" element={<Analytics />} />
              <Route path="financial/*" element={<FinancialManagement />} />
              <Route path="customers/*" element={<CustomerManagement />} />
              <Route path="content/*" element={<ContentManagement />} />
              <Route path="reviews/*" element={<ReviewManagement />} />
              <Route path="communication/*" element={<CommunicationTools />} />
              <Route path="safety/*" element={<SafetyCompliance />} />
              <Route path="profile" element={<OrganizerProfile />} />
              <Route path="availability" element={<AvailabilityCalendar />} />
              <Route path="pricing" element={<AdvancedPricing />} />
              <Route path="advanced-analytics" element={<AdvancedAnalytics />} />
              <Route path="automation" element={<AutomationTools />} />
              <Route path="onboarding" element={<OrganizerOnboarding />} />
              <Route path="*" element={<Navigate to="/organizer" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerDashboard
