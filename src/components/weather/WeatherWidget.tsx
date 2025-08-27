import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,

  AlertTriangle,
  Calendar,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { weatherService } from '../../services/weatherService'
import type { WeatherData } from '../../services/weatherService'
import { cn } from '../../utils/cn'

interface WeatherWidgetProps {
  location: string
  coordinates?: { lat: number; lng: number }
  compact?: boolean
  showForecast?: boolean
  showBestTime?: boolean
  className?: string
}

const WeatherWidget = ({
  location,
  coordinates,
  compact = false,
  showForecast = true,
  showBestTime = true,
  className
}: WeatherWidgetProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    loadWeatherData()
  }, [location, coordinates])

  const loadWeatherData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await weatherService.getWeatherData(location, coordinates)
      setWeatherData(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to load weather data')
      console.error('Weather error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getWeatherIcon = (condition: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }

    const iconClass = sizeClasses[size]

    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className={cn(iconClass, 'text-yellow-500')} />
      case 'partly cloudy':
      case 'partly-cloudy':
        return <Cloud className={cn(iconClass, 'text-gray-500')} />
      case 'cloudy':
      case 'overcast':
        return <Cloud className={cn(iconClass, 'text-gray-600')} />
      case 'rain':
      case 'light rain':
      case 'light-rain':
        return <CloudRain className={cn(iconClass, 'text-blue-500')} />
      default:
        return <Sun className={cn(iconClass, 'text-yellow-500')} />
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) {return 'text-blue-600'}
    if (temp < 10) {return 'text-blue-500'}
    if (temp < 20) {return 'text-green-500'}
    if (temp < 30) {return 'text-yellow-500'}
    if (temp < 40) {return 'text-orange-500'}
    return 'text-red-500'
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'severe': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className={cn("bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700", className)}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className={cn("bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700", className)}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{error || 'Weather data unavailable'}</p>
          <button
            onClick={loadWeatherData}
            className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={cn("bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weatherData.current.condition, 'sm')}
            <span className={cn("text-lg font-semibold", getTemperatureColor(weatherData.current.temperature))}>
              {weatherData.current.temperature}°C
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {weatherData.current.condition}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Feels like {weatherData.current.feelsLike}°C
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weather Conditions
          </h3>
          <button
            onClick={loadWeatherData}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weatherData.current.condition, 'lg')}
            <div>
              <div className={cn("text-3xl font-bold", getTemperatureColor(weatherData.current.temperature))}>
                {weatherData.current.temperature}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Feels like {weatherData.current.feelsLike}°C
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {weatherData.current.condition}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {weatherData.current.description}
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {weatherData.current.windSpeed} km/h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {weatherData.current.windDirection}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {weatherData.current.humidity}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {weatherData.current.visibility} km
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Visibility</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {weatherData.current.pressure} hPa
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Pressure</div>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherData.alerts && weatherData.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Weather Alerts</span>
            </h4>
            {weatherData.alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn("p-3 rounded-lg border", getAlertColor(alert.severity))}
              >
                <div className="font-medium mb-1">{alert.title}</div>
                <div className="text-sm">{alert.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Forecast */}
        {showForecast && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>5-Day Forecast</span>
            </h4>
            <div className="space-y-2">
              {weatherData.forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(day.condition, 'sm')}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {day.day}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {day.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {day.high}° / {day.low}°
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {day.precipitation}% rain
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Time to Visit */}
        {showBestTime && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Best Time to Visit</span>
            </h4>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  {weatherData.bestTimeToVisit.months.join(', ')}
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                {weatherData.bestTimeToVisit.reason}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-green-800 dark:text-green-300">Temperature</div>
                  <div className="text-green-700 dark:text-green-400">
                    {weatherData.bestTimeToVisit.temperature.min}°C - {weatherData.bestTimeToVisit.temperature.max}°C
                  </div>
                </div>
                <div>
                  <div className="font-medium text-green-800 dark:text-green-300">Rainfall</div>
                  <div className="text-green-700 dark:text-green-400">
                    {weatherData.bestTimeToVisit.rainfall}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="font-medium text-green-800 dark:text-green-300 mb-1">Conditions</div>
                <div className="flex flex-wrap gap-1">
                  {weatherData.bestTimeToVisit.conditions.map((condition, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded text-xs"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherWidget
