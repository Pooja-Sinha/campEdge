import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share2,
  Play,
  Pause,
  RotateCw,
  Maximize2
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

interface Image {
  id: string
  url: string
  alt: string
  caption?: string
  category?: string
}

interface ImageGalleryProps {
  images: Image[]
  initialIndex?: number
  onClose?: () => void
  showThumbnails?: boolean
  showControls?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

const ImageGallery = ({
  images,
  initialIndex = 0,
  onClose,
  showThumbnails = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className
}: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [rotation, setRotation] = useState(0)
  const [, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentImage = images[currentIndex]

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length)
      }, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, images.length, autoPlayInterval])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
        case 'Escape':
          e.preventDefault()
          if (isZoomed) {
            resetZoom()
          } else {
            onClose?.()
          }
          break
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
        case '+':
        case '=':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case 'r':
          e.preventDefault()
          rotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
    resetZoom()
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    resetZoom()
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
    resetZoom()
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
    setIsZoomed(true)
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5))
    if (zoomLevel <= 1) {
      setIsZoomed(false)
    }
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setIsZoomed(false)
    setRotation(0)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const downloadImage = async () => {
    if (!currentImage) {return}

    try {
      const response = await fetch(currentImage.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `camp-image-${currentIndex + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const shareImage = async () => {
    if (!currentImage) {return}

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.alt,
          text: currentImage.caption || currentImage.alt,
          url: currentImage.url,
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(currentImage.url)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    if (e.targetTouches[0]) {
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      })
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {return}
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50
    // const isUpSwipe = distanceY > 50
    // const isDownSwipe = distanceY < -50

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        goToNext()
      } else if (isRightSwipe) {
        goToPrevious()
      }
    }
  }

  if (!currentImage) {return null}

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Image */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        <img
          ref={imageRef}
          src={currentImage.url}
          alt={currentImage.alt}
          className={cn(
            "max-w-full max-h-full object-contain transition-transform duration-300",
            isZoomed && "cursor-move"
          )}
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            cursor: isZoomed ? 'move' : 'default'
          }}
          onClick={() => !isZoomed && zoomIn()}
          draggable={false}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 flex space-x-2">
          {/* Zoom Controls */}
          <div className="bg-black bg-opacity-50 rounded-lg p-1 flex space-x-1">
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Playback Controls */}
          {images.length > 1 && (
            <div className="bg-black bg-opacity-50 rounded-lg p-1">
              <button
                onClick={togglePlayPause}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Action Controls */}
          <div className="bg-black bg-opacity-50 rounded-lg p-1 flex space-x-1">
            <button
              onClick={downloadImage}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={shareImage}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Info */}
      <div className="absolute bottom-20 left-4 right-4 text-center">
        <h3 className="text-white text-lg font-semibold mb-1">
          {currentImage.alt}
        </h3>
        {currentImage.caption && (
          <p className="text-gray-300 text-sm">
            {currentImage.caption}
          </p>
        )}
        <div className="text-gray-400 text-sm mt-2">
          {currentIndex + 1} of {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2 max-w-full overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                "flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-white"
                  : "border-transparent hover:border-gray-400"
              )}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageGallery
