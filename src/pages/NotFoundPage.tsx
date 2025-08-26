import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center section-padding">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
