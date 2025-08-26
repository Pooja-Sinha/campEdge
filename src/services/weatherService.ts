// Weather Service - Mock implementation with realistic data
// In production, this would integrate with OpenWeatherMap, AccuWeather, or similar APIs

export interface WeatherData {
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDirection: string
    pressure: number
    visibility: number
    uvIndex: number
    condition: string
    icon: string
    description: string
  }
  forecast: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    icon: string
    description: string
    precipitation: number
    humidity: number
    windSpeed: number
  }>
  alerts?: Array<{
    id: string
    type: 'warning' | 'watch' | 'advisory'
    title: string
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
    startTime: string
    endTime: string
  }>
  bestTimeToVisit: {
    months: string[]
    reason: string
    temperature: { min: number; max: number }
    rainfall: string
    conditions: string[]
  }
}

// Mock weather data for different locations
const mockWeatherData: Record<string, WeatherData> = {
  // Himachal Pradesh (Triund)
  'himachal-pradesh': {
    current: {
      temperature: 12,
      feelsLike: 8,
      humidity: 65,
      windSpeed: 15,
      windDirection: 'NW',
      pressure: 1015,
      visibility: 10,
      uvIndex: 6,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      description: 'Partly cloudy with cool mountain breeze'
    },
    forecast: [
      {
        date: '2024-11-16',
        day: 'Today',
        high: 15,
        low: 5,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        description: 'Cool and pleasant',
        precipitation: 10,
        humidity: 60,
        windSpeed: 12
      },
      {
        date: '2024-11-17',
        day: 'Tomorrow',
        high: 18,
        low: 7,
        condition: 'Sunny',
        icon: 'sunny',
        description: 'Clear mountain skies',
        precipitation: 0,
        humidity: 55,
        windSpeed: 8
      },
      {
        date: '2024-11-18',
        day: 'Monday',
        high: 16,
        low: 6,
        condition: 'Cloudy',
        icon: 'cloudy',
        description: 'Overcast with cool temperatures',
        precipitation: 20,
        humidity: 70,
        windSpeed: 10
      }
    ],
    bestTimeToVisit: {
      months: ['March', 'April', 'May', 'September', 'October', 'November'],
      reason: 'Pleasant weather with clear mountain views and comfortable trekking conditions',
      temperature: { min: 5, max: 25 },
      rainfall: 'Low to moderate',
      conditions: ['Clear skies', 'Cool temperatures', 'Low humidity', 'Minimal rainfall']
    }
  },

  // Rajasthan (Jaisalmer)
  'rajasthan': {
    current: {
      temperature: 28,
      feelsLike: 32,
      humidity: 25,
      windSpeed: 8,
      windDirection: 'W',
      pressure: 1012,
      visibility: 15,
      uvIndex: 8,
      condition: 'Sunny',
      icon: 'sunny',
      description: 'Hot and dry desert conditions'
    },
    forecast: [
      {
        date: '2024-11-16',
        day: 'Today',
        high: 32,
        low: 18,
        condition: 'Sunny',
        icon: 'sunny',
        description: 'Hot and sunny',
        precipitation: 0,
        humidity: 25,
        windSpeed: 8
      },
      {
        date: '2024-11-17',
        day: 'Tomorrow',
        high: 30,
        low: 16,
        condition: 'Clear',
        icon: 'clear',
        description: 'Clear desert skies',
        precipitation: 0,
        humidity: 20,
        windSpeed: 12
      },
      {
        date: '2024-11-18',
        day: 'Monday',
        high: 29,
        low: 15,
        condition: 'Sunny',
        icon: 'sunny',
        description: 'Bright and warm',
        precipitation: 0,
        humidity: 22,
        windSpeed: 10
      }
    ],
    bestTimeToVisit: {
      months: ['October', 'November', 'December', 'January', 'February', 'March'],
      reason: 'Cooler temperatures make desert camping comfortable with clear starry nights',
      temperature: { min: 10, max: 30 },
      rainfall: 'Very low',
      conditions: ['Clear skies', 'Low humidity', 'Cool nights', 'Excellent visibility']
    }
  },

  // Karnataka (Gokarna)
  'karnataka': {
    current: {
      temperature: 26,
      feelsLike: 29,
      humidity: 78,
      windSpeed: 12,
      windDirection: 'SW',
      pressure: 1010,
      visibility: 8,
      uvIndex: 7,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      description: 'Warm and humid coastal weather'
    },
    forecast: [
      {
        date: '2024-11-16',
        day: 'Today',
        high: 29,
        low: 22,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        description: 'Warm with sea breeze',
        precipitation: 15,
        humidity: 75,
        windSpeed: 15
      },
      {
        date: '2024-11-17',
        day: 'Tomorrow',
        high: 28,
        low: 21,
        condition: 'Cloudy',
        icon: 'cloudy',
        description: 'Overcast coastal weather',
        precipitation: 25,
        humidity: 80,
        windSpeed: 18
      },
      {
        date: '2024-11-18',
        day: 'Monday',
        high: 27,
        low: 20,
        condition: 'Light Rain',
        icon: 'light-rain',
        description: 'Light coastal showers',
        precipitation: 60,
        humidity: 85,
        windSpeed: 20
      }
    ],
    bestTimeToVisit: {
      months: ['October', 'November', 'December', 'January', 'February', 'March'],
      reason: 'Post-monsoon period with pleasant weather and calm seas perfect for beach camping',
      temperature: { min: 20, max: 32 },
      rainfall: 'Low to moderate',
      conditions: ['Pleasant temperatures', 'Calm seas', 'Clear skies', 'Gentle breeze']
    }
  },

  // Maharashtra (Lonavala)
  'maharashtra': {
    current: {
      temperature: 24,
      feelsLike: 26,
      humidity: 60,
      windSpeed: 10,
      windDirection: 'W',
      pressure: 1013,
      visibility: 12,
      uvIndex: 6,
      condition: 'Pleasant',
      icon: 'partly-cloudy',
      description: 'Pleasant hill station weather'
    },
    forecast: [
      {
        date: '2024-11-16',
        day: 'Today',
        high: 27,
        low: 18,
        condition: 'Pleasant',
        icon: 'partly-cloudy',
        description: 'Perfect for outdoor activities',
        precipitation: 5,
        humidity: 58,
        windSpeed: 8
      },
      {
        date: '2024-11-17',
        day: 'Tomorrow',
        high: 26,
        low: 17,
        condition: 'Sunny',
        icon: 'sunny',
        description: 'Bright and comfortable',
        precipitation: 0,
        humidity: 55,
        windSpeed: 12
      },
      {
        date: '2024-11-18',
        day: 'Monday',
        high: 25,
        low: 16,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        description: 'Cool and pleasant',
        precipitation: 10,
        humidity: 62,
        windSpeed: 10
      }
    ],
    bestTimeToVisit: {
      months: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
      reason: 'Cool and pleasant weather ideal for family camping and outdoor activities',
      temperature: { min: 15, max: 30 },
      rainfall: 'Low',
      conditions: ['Cool temperatures', 'Pleasant breeze', 'Clear views', 'Comfortable humidity']
    }
  },

  // Ladakh
  'ladakh': {
    current: {
      temperature: -5,
      feelsLike: -12,
      humidity: 35,
      windSpeed: 20,
      windDirection: 'N',
      pressure: 850,
      visibility: 20,
      uvIndex: 9,
      condition: 'Clear',
      icon: 'clear-cold',
      description: 'Clear high-altitude conditions'
    },
    forecast: [
      {
        date: '2024-11-16',
        day: 'Today',
        high: 2,
        low: -8,
        condition: 'Clear',
        icon: 'clear-cold',
        description: 'Crystal clear mountain air',
        precipitation: 0,
        humidity: 30,
        windSpeed: 25
      },
      {
        date: '2024-11-17',
        day: 'Tomorrow',
        high: 0,
        low: -10,
        condition: 'Sunny',
        icon: 'sunny-cold',
        description: 'Bright but very cold',
        precipitation: 0,
        humidity: 25,
        windSpeed: 30
      },
      {
        date: '2024-11-18',
        day: 'Monday',
        high: -2,
        low: -12,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy-cold',
        description: 'Cold with some clouds',
        precipitation: 5,
        humidity: 40,
        windSpeed: 22
      }
    ],
    alerts: [
      {
        id: 'ladakh-cold-1',
        type: 'warning',
        title: 'Extreme Cold Warning',
        description: 'Temperatures will drop significantly below freezing. Proper cold weather gear essential.',
        severity: 'severe',
        startTime: '2024-11-16T18:00:00Z',
        endTime: '2024-11-18T08:00:00Z'
      }
    ],
    bestTimeToVisit: {
      months: ['June', 'July', 'August', 'September'],
      reason: 'Summer months offer the only accessible and relatively warm weather for high-altitude camping',
      temperature: { min: -5, max: 25 },
      rainfall: 'Very low',
      conditions: ['Clear skies', 'Extreme altitude', 'Low oxygen', 'Intense UV radiation']
    }
  }
}

class WeatherService {
  private apiKey: string = process.env.REACT_APP_WEATHER_API_KEY || 'mock-api-key'
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5'

  // Get weather data for a location
  async getWeatherData(location: string, coordinates?: { lat: number; lng: number }): Promise<WeatherData> {
    try {
      // In production, make actual API call
      if (this.apiKey !== 'mock-api-key' && coordinates) {
        return await this.fetchRealWeatherData(coordinates)
      }

      // Return mock data based on location
      const locationKey = this.getLocationKey(location)
      const weatherData = mockWeatherData[locationKey] || mockWeatherData['maharashtra']

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return weatherData
    } catch (error) {
      console.error('Weather API error:', error)
      // Return fallback data
      return mockWeatherData['maharashtra']
    }
  }

  // Get weather alerts for a location
  async getWeatherAlerts(location: string): Promise<WeatherData['alerts']> {
    const weatherData = await this.getWeatherData(location)
    return weatherData.alerts || []
  }

  // Get best time to visit information
  async getBestTimeToVisit(location: string): Promise<WeatherData['bestTimeToVisit']> {
    const weatherData = await this.getWeatherData(location)
    return weatherData.bestTimeToVisit
  }

  // Private method to fetch real weather data (for production)
  private async fetchRealWeatherData(coordinates: { lat: number; lng: number }): Promise<WeatherData> {
    const { lat, lng } = coordinates

    // Current weather
    const currentResponse = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
    )
    const currentData = await currentResponse.json()

    // 5-day forecast
    const forecastResponse = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
    )
    const forecastData = await forecastResponse.json()

    // Transform API response to our format
    return this.transformApiResponse(currentData, forecastData)
  }

  // Transform API response to our WeatherData format
  private transformApiResponse(currentData: any, forecastData: any): WeatherData {
    return {
      current: {
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: this.getWindDirection(currentData.wind.deg),
        pressure: currentData.main.pressure,
        visibility: Math.round(currentData.visibility / 1000), // Convert to km
        uvIndex: 0, // Would need separate UV API call
        condition: currentData.weather[0].main,
        icon: currentData.weather[0].icon,
        description: currentData.weather[0].description
      },
      forecast: forecastData.list.slice(0, 5).map((item: any, index: number) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 
             new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        precipitation: Math.round((item.pop || 0) * 100),
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6)
      })),
      bestTimeToVisit: {
        months: ['October', 'November', 'December', 'January', 'February', 'March'],
        reason: 'Based on historical weather patterns',
        temperature: { min: 10, max: 30 },
        rainfall: 'Moderate',
        conditions: ['Pleasant temperatures', 'Clear skies']
      }
    }
  }

  // Helper method to get location key for mock data
  private getLocationKey(location: string): string {
    const locationLower = location.toLowerCase()
    
    if (locationLower.includes('himachal') || locationLower.includes('triund') || 
        locationLower.includes('manali') || locationLower.includes('dharamshala')) {
      return 'himachal-pradesh'
    }
    if (locationLower.includes('rajasthan') || locationLower.includes('jaisalmer') || 
        locationLower.includes('desert')) {
      return 'rajasthan'
    }
    if (locationLower.includes('karnataka') || locationLower.includes('gokarna') || 
        locationLower.includes('coorg')) {
      return 'karnataka'
    }
    if (locationLower.includes('ladakh') || locationLower.includes('leh')) {
      return 'ladakh'
    }
    
    return 'maharashtra' // Default
  }

  // Helper method to convert wind degrees to direction
  private getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }
}

export const weatherService = new WeatherService()
