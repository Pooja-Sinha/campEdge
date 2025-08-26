import { useState, useEffect } from 'react'

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if value changes before delay is reached
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook that debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay, ...deps])

  return debouncedCallback
}

/**
 * Custom hook for debounced search functionality
 * @param searchFunction - The search function to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns Object with search function and loading state
 */
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<T | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const debouncedSearch = useDebouncedCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults(null)
        setSearchError(null)
        return
      }

      setIsSearching(true)
      setSearchError(null)

      try {
        const results = await searchFunction(query)
        setSearchResults(results)
      } catch (error) {
        setSearchError(error instanceof Error ? error.message : 'Search failed')
        setSearchResults(null)
      } finally {
        setIsSearching(false)
      }
    },
    delay,
    [searchFunction]
  )

  return {
    search: debouncedSearch,
    isSearching,
    searchResults,
    searchError,
    clearResults: () => {
      setSearchResults(null)
      setSearchError(null)
    }
  }
}
