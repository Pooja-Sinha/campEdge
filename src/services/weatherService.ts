// Weather Service - Mock implementation with realistic data
// In production, this would integrate with OpenWeatherMap, AccuWeather, or similar APIs

import weatherMockData from '../data/weather_mock_data.json'

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
  forecast: {
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
  }[]
  alerts?: {
    id: string
    type: 'warning' | 'watch' | 'advisory'
    title: string
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
    startTime: string
    endTime: string
  }[]
  bestTimeToVisit: {
    months: string[]
    reason: string
    temperature: { min: number; max: number }
    rainfall: string
    conditions: string[]
  }
}

// Mock weather data for different locations
const mockWeatherData: Record<string, WeatherData> = weatherMockData as Record<string, WeatherData>



class WeatherService {
  private readonly apiKey: string = import.meta.env['VITE_WEATHER_API_KEY'] || 'mock-api-key'
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5'

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

      return weatherData || mockWeatherData['maharashtra'] || {
        current: {
          temperature: 25,
          feelsLike: 27,
          humidity: 60,
          windSpeed: 10,
          windDirection: 'NE',
          pressure: 1013,
          visibility: 10,
          uvIndex: 5,
          condition: 'Clear',
          icon: 'sunny',
          description: 'Clear sky'
        },
        forecast: [],
        bestTimeToVisit: {
          months: ['October', 'November', 'December', 'January', 'February', 'March'],
          reason: 'Pleasant weather with comfortable temperatures',
          temperature: { min: 15, max: 30 },
          rainfall: 'Low',
          conditions: ['Clear skies', 'Mild temperatures', 'Low humidity']
        }
      }
    } catch (error) {
      console.error('Weather API error:', error)
      // Return fallback data
      return mockWeatherData['maharashtra'] || {
        current: {
          temperature: 25,
          feelsLike: 27,
          humidity: 60,
          windSpeed: 10,
          windDirection: 'NE',
          pressure: 1013,
          visibility: 10,
          uvIndex: 5,
          condition: 'Clear',
          icon: 'sunny',
          description: 'Clear sky'
        },
        forecast: [],
        bestTimeToVisit: {
          months: ['October', 'November', 'December', 'January', 'February', 'March'],
          reason: 'Pleasant weather with comfortable temperatures',
          temperature: { min: 15, max: 30 },
          rainfall: 'Low',
          conditions: ['Clear skies', 'Mild temperatures', 'Low humidity']
        }
      }
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
    return directions[index] || 'N'
  }
}

export const weatherService = new WeatherService()
