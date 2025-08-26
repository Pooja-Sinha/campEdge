import { useRef, useCallback, useEffect } from 'react'

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
  duration: number
}

interface PinchGesture {
  scale: number
  center: { x: number; y: number }
}

interface TapGesture {
  x: number
  y: number
  timestamp: number
}

interface GestureCallbacks {
  onSwipe?: (gesture: SwipeGesture) => void
  onPinch?: (gesture: PinchGesture) => void
  onTap?: (gesture: TapGesture) => void
  onDoubleTap?: (gesture: TapGesture) => void
  onLongPress?: (gesture: TapGesture) => void
  onPanStart?: (point: TouchPoint) => void
  onPanMove?: (point: TouchPoint, delta: { x: number; y: number }) => void
  onPanEnd?: (point: TouchPoint) => void
}

interface GestureOptions {
  swipeThreshold?: number
  tapThreshold?: number
  doubleTapDelay?: number
  longPressDelay?: number
  pinchThreshold?: number
  preventDefault?: boolean
}

export const useTouchGestures = (
  callbacks: GestureCallbacks,
  options: GestureOptions = {}
) => {
  const {
    swipeThreshold = 50,
    tapThreshold = 10,
    doubleTapDelay = 300,
    longPressDelay = 500,
    pinchThreshold = 0.1,
    preventDefault = true
  } = options

  const touchStartRef = useRef<TouchPoint | null>(null)
  const touchEndRef = useRef<TouchPoint | null>(null)
  const lastTapRef = useRef<TapGesture | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isPanningRef = useRef(false)
  const initialPinchDistanceRef = useRef<number | null>(null)
  const lastPinchScaleRef = useRef(1)

  // Helper functions
  const getDistance = (point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point2.x - point1.x
    const dy = point2.y - point1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getSwipeDirection = (start: TouchPoint, end: TouchPoint): SwipeGesture['direction'] => {
    const dx = end.x - start.x
    const dy = end.y - start.y
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left'
    } else {
      return dy > 0 ? 'down' : 'up'
    }
  }

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    const touch = e.touches[0]
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }

    touchStartRef.current = touchPoint
    touchEndRef.current = null
    isPanningRef.current = false

    // Handle multi-touch for pinch
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      initialPinchDistanceRef.current = distance
      lastPinchScaleRef.current = 1
      clearLongPressTimer()
      return
    }

    // Start long press timer
    if (callbacks.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        if (touchStartRef.current && !isPanningRef.current) {
          callbacks.onLongPress!(touchStartRef.current)
        }
      }, longPressDelay)
    }

    // Call pan start
    if (callbacks.onPanStart) {
      callbacks.onPanStart(touchPoint)
    }
  }, [callbacks, preventDefault, longPressDelay])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    if (!touchStartRef.current) return

    const touch = e.touches[0]
    const currentPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }

    // Handle pinch gesture
    if (e.touches.length === 2 && initialPinchDistanceRef.current && callbacks.onPinch) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
      const scale = currentDistance / initialPinchDistanceRef.current
      
      if (Math.abs(scale - lastPinchScaleRef.current) > pinchThreshold) {
        const center = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
        }
        
        callbacks.onPinch({ scale, center })
        lastPinchScaleRef.current = scale
      }
      return
    }

    // Check if movement exceeds tap threshold
    const distance = getDistance(touchStartRef.current, currentPoint)
    if (distance > tapThreshold) {
      isPanningRef.current = true
      clearLongPressTimer()
      
      // Call pan move
      if (callbacks.onPanMove) {
        const delta = {
          x: currentPoint.x - touchStartRef.current.x,
          y: currentPoint.y - touchStartRef.current.y
        }
        callbacks.onPanMove(currentPoint, delta)
      }
    }

    touchEndRef.current = currentPoint
  }, [callbacks, tapThreshold, pinchThreshold])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    clearLongPressTimer()

    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const endPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }

    touchEndRef.current = endPoint

    // Reset pinch state
    if (e.touches.length === 0) {
      initialPinchDistanceRef.current = null
      lastPinchScaleRef.current = 1
    }

    // Call pan end
    if (callbacks.onPanEnd && isPanningRef.current) {
      callbacks.onPanEnd(endPoint)
      isPanningRef.current = false
      touchStartRef.current = null
      return
    }

    // Handle swipe gesture
    if (touchStartRef.current && callbacks.onSwipe) {
      const distance = getDistance(touchStartRef.current, endPoint)
      const duration = endPoint.timestamp - touchStartRef.current.timestamp
      
      if (distance >= swipeThreshold && duration < 1000) {
        const direction = getSwipeDirection(touchStartRef.current, endPoint)
        const velocity = distance / duration
        
        callbacks.onSwipe({
          direction,
          distance,
          velocity,
          duration
        })
        
        touchStartRef.current = null
        return
      }
    }

    // Handle tap gestures
    if (touchStartRef.current && !isPanningRef.current) {
      const distance = getDistance(touchStartRef.current, endPoint)
      
      if (distance <= tapThreshold) {
        const tapGesture: TapGesture = {
          x: endPoint.x,
          y: endPoint.y,
          timestamp: endPoint.timestamp
        }

        // Check for double tap
        if (lastTapRef.current && callbacks.onDoubleTap) {
          const timeDiff = tapGesture.timestamp - lastTapRef.current.timestamp
          const tapDistance = getDistance(lastTapRef.current, tapGesture)
          
          if (timeDiff <= doubleTapDelay && tapDistance <= tapThreshold) {
            callbacks.onDoubleTap(tapGesture)
            lastTapRef.current = null
            touchStartRef.current = null
            return
          }
        }

        // Single tap
        if (callbacks.onTap) {
          callbacks.onTap(tapGesture)
        }
        
        lastTapRef.current = tapGesture
      }
    }

    touchStartRef.current = null
    isPanningRef.current = false
  }, [callbacks, swipeThreshold, tapThreshold, doubleTapDelay, preventDefault])

  // Attach event listeners
  const attachListeners = useCallback((element: HTMLElement) => {
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault })
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: !preventDefault })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
      clearLongPressTimer()
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLongPressTimer()
    }
  }, [])

  return {
    attachListeners,
    isActive: touchStartRef.current !== null,
    isPanning: isPanningRef.current
  }
}
