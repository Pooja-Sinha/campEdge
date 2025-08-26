import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import PWAInstallPrompt from '../common/PWAInstallPrompt'
import NotificationSystem from '../common/NotificationSystem'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <PWAInstallPrompt />
      <NotificationSystem />
    </div>
  )
}

export default Layout
