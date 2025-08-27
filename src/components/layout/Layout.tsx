import type { ReactNode } from 'react'
import NotificationSystem from '../common/NotificationSystem'
import PWAInstallPrompt from '../common/PWAInstallPrompt'
import Footer from './Footer'
import Header from './Header'

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
