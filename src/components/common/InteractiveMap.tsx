import { MapPin, Plus, Minus, Maximize2, Navigation, Layers } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Camp } from '../../types'
import { cn } from '../../utils/cn'

interface InteractiveMapProps {
  camps: Camp[]
  selectedCamp?: string
  onCampSelect?: (campId: string) => void
  height?: string
  showControls?: boolean
  showCampInfo?: boolean
  className?: string
}

interface MapMarker {
  id: string
  lat: number
  lng: number
  camp: Camp
}

const InteractiveMap = ({
  camps,
  selectedCamp,
  onCampSelect,
  height = '400px',
  showControls = true,
  showCampInfo = true,
  className
}: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [, setZoom] = useState(6)
  const [, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }) // Center of India
  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'roadmap'>('terrain')
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Convert camps to markers
  const markers: MapMarker[] = camps.map(camp => ({
    id: camp.id,
    lat: camp.location.coordinates.latitude,
    lng: camp.location.coordinates.longitude,
    camp
  }))

  // Calculate bounds to fit all markers
  useEffect(() => {
    if (markers.length > 0) {
      const lats = markers.map(m => m.lat)
      const lngs = markers.map(m => m.lng)
      
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      
      const centerLat = (minLat + maxLat) / 2
      const centerLng = (minLng + maxLng) / 2
      
      setCenter({ lat: centerLat, lng: centerLng })
      
      // Adjust zoom based on bounds
      const latDiff = maxLat - minLat
      const lngDiff = maxLng - minLng
      const maxDiff = Math.max(latDiff, lngDiff)
      
      if (maxDiff > 20) {setZoom(4)}
      else if (maxDiff > 10) {setZoom(5)}
      else if (maxDiff > 5) {setZoom(6)}
      else if (maxDiff > 2) {setZoom(7)}
      else {setZoom(8)}
    }
  }, [markers])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(18, prev + 1))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(3, prev - 1))
  }

  const handleMarkerClick = (markerId: string) => {
    onCampSelect?.(markerId)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getMarkerPosition = (marker: MapMarker) => {
    // Simple projection for demo - in real app would use proper map library
    const mapWidth = mapRef.current?.clientWidth || 800
    const mapHeight = mapRef.current?.clientHeight || 400
    
    // India bounds approximately
    const bounds = {
      north: 37.6,
      south: 6.4,
      east: 97.25,
      west: 68.7
    }
    
    const x = ((marker.lng - bounds.west) / (bounds.east - bounds.west)) * mapWidth
    const y = ((bounds.north - marker.lat) / (bounds.north - bounds.south)) * mapHeight
    
    return { x, y }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'challenging': return 'bg-orange-500'
      case 'extreme': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className={cn(
      "relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700",
      isFullscreen && "fixed inset-0 z-50 rounded-none",
      className
    )} style={{ height: isFullscreen ? '100vh' : height }}>
      {/* Map Background */}
      <div
        ref={mapRef}
        className="w-full h-full relative bg-gradient-to-br from-green-100 via-blue-50 to-blue-100 dark:from-green-900 dark:via-blue-900 dark:to-blue-800"
        style={{
          backgroundImage: mapStyle === 'satellite' 
            ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            : mapStyle === 'terrain'
            ? 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23065f46" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3C/g%3E%3C/svg%3E")'
            : undefined
        }}
      >
        {/* India Outline (Simplified) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M200 100 L600 120 L650 200 L620 350 L580 450 L500 500 L400 480 L300 460 L250 400 L200 300 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-600 dark:text-green-400"
          />
        </svg>

        {/* Camp Markers */}
        {markers.map((marker) => {
          const position = getMarkerPosition(marker)
          const isSelected = selectedCamp === marker.id
          const isHovered = hoveredMarker === marker.id

          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: isSelected || isHovered ? 20 : 10
              }}
              onClick={() => handleMarkerClick(marker.id)}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              {/* Marker */}
              <div className={cn(
                "relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-all duration-200",
                getDifficultyColor(marker.camp.difficulty),
                isSelected || isHovered ? "w-8 h-8 scale-125" : "w-6 h-6",
                "hover:scale-125"
              )}>
                <MapPin className="w-3 h-3 text-white" />
                
                {/* Pulse animation for selected */}
                {isSelected && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-ping",
                    getDifficultyColor(marker.camp.difficulty),
                    "opacity-75"
                  )} />
                )}
              </div>

              {/* Tooltip */}
              {(isHovered || isSelected) && showCampInfo && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-30">
                  <div className="flex items-start space-x-3">
                    <img
                      src={marker.camp.images.find(img => img.isPrimary)?.url}
                      alt={marker.camp.title}
                      className="w-16 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {marker.camp.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {marker.camp.location.name}, {marker.camp.location.state}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium text-white",
                          getDifficultyColor(marker.camp.difficulty)
                        )}>
                          {marker.camp.difficulty}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{marker.camp.pricing.basePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* Zoom Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleZoomOut}
              className="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Map Style Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setMapStyle(mapStyle === 'terrain' ? 'satellite' : mapStyle === 'satellite' ? 'roadmap' : 'terrain')}
              className="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Change map style"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={toggleFullscreen}
              className="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Difficulty Levels</h4>
        <div className="space-y-1">
          {[
            { level: 'easy', color: 'bg-green-500', label: 'Easy' },
            { level: 'moderate', color: 'bg-yellow-500', label: 'Moderate' },
            { level: 'challenging', color: 'bg-orange-500', label: 'Challenging' },
            { level: 'extreme', color: 'bg-red-500', label: 'Extreme' }
          ].map(({ level, color, label }) => (
            <div key={level} className="flex items-center space-x-2">
              <div className={cn("w-3 h-3 rounded-full", color)} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Info */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {markers.length} Camps Available
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Click markers to view details
        </p>
      </div>
    </div>
  )
}

export default InteractiveMap
