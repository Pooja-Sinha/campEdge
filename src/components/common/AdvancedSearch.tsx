import { useState, useEffect, useRef, useMemo } from 'react'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter,
  X,
  Clock,
  Star,
  TrendingUp,
  History
} from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'
import { cn } from '../../utils/cn'

interface SearchSuggestion {
  id: string
  type: 'location' | 'camp' | 'activity' | 'recent' | 'popular'
  title: string
  subtitle?: string
  icon?: React.ReactNode
  category?: string
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters?: any) => void
  placeholder?: string
  showFilters?: boolean
  showSuggestions?: boolean
  recentSearches?: string[]
  popularSearches?: string[]
  className?: string
}

const AdvancedSearch = ({
  onSearch,
  placeholder = "Search destinations, camps, activities...",
  showFilters = true,
  showSuggestions = true,
  recentSearches = [],
  popularSearches = [],
  className
}: AdvancedSearchProps) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  // Mock data for suggestions
  const mockSuggestions: SearchSuggestion[] = useMemo(() => [
    // Locations
    { id: 'loc-1', type: 'location', title: 'Himachal Pradesh', subtitle: '15 camps available', icon: <MapPin className="w-4 h-4" /> },
    { id: 'loc-2', type: 'location', title: 'Rajasthan', subtitle: '8 camps available', icon: <MapPin className="w-4 h-4" /> },
    { id: 'loc-3', type: 'location', title: 'Kerala', subtitle: '6 camps available', icon: <MapPin className="w-4 h-4" /> },
    { id: 'loc-4', type: 'location', title: 'Uttarakhand', subtitle: '12 camps available', icon: <MapPin className="w-4 h-4" /> },
    
    // Camps
    { id: 'camp-1', type: 'camp', title: 'Triund Trek & Camping', subtitle: 'Himachal Pradesh • ₹3,500', icon: <Star className="w-4 h-4" /> },
    { id: 'camp-2', type: 'camp', title: 'Jaisalmer Desert Safari', subtitle: 'Rajasthan • ₹4,200', icon: <Star className="w-4 h-4" /> },
    { id: 'camp-3', type: 'camp', title: 'Gokarna Beach Camping', subtitle: 'Karnataka • ₹2,800', icon: <Star className="w-4 h-4" /> },
    
    // Activities
    { id: 'act-1', type: 'activity', title: 'Trekking', subtitle: '25 camps offer this', category: 'Adventure' },
    { id: 'act-2', type: 'activity', title: 'Photography', subtitle: '18 camps offer this', category: 'Creative' },
    { id: 'act-3', type: 'activity', title: 'Wildlife Safari', subtitle: '12 camps offer this', category: 'Nature' },
    { id: 'act-4', type: 'activity', title: 'River Rafting', subtitle: '8 camps offer this', category: 'Adventure' },
  ], [])

  // Filter suggestions based on query
  const filteredSuggestions = useMemo(() => {
    if (!debouncedQuery.trim()) {
      const suggestions: SearchSuggestion[] = []
      
      // Add recent searches
      if (recentSearches.length > 0) {
        suggestions.push(
          ...recentSearches.slice(0, 3).map((search, index) => ({
            id: `recent-${index}`,
            type: 'recent' as const,
            title: search,
            icon: <History className="w-4 h-4" />
          }))
        )
      }
      
      // Add popular searches
      if (popularSearches.length > 0) {
        suggestions.push(
          ...popularSearches.slice(0, 3).map((search, index) => ({
            id: `popular-${index}`,
            type: 'popular' as const,
            title: search,
            icon: <TrendingUp className="w-4 h-4" />
          }))
        )
      }
      
      return suggestions
    }

    return mockSuggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      suggestion.subtitle?.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, recentSearches, popularSearches, mockSuggestions])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0) {
            handleSuggestionClick(filteredSuggestions[selectedIndex])
          } else {
            handleSearch()
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredSuggestions])

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim())
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    onSearch(suggestion.title)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const clearSearch = () => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon
    
    switch (suggestion.type) {
      case 'location':
        return <MapPin className="w-4 h-4" />
      case 'camp':
        return <Star className="w-4 h-4" />
      case 'activity':
        return <Calendar className="w-4 h-4" />
      case 'recent':
        return <History className="w-4 h-4" />
      case 'popular':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'location': return 'Location'
      case 'camp': return 'Camp'
      case 'activity': return 'Activity'
      case 'recent': return 'Recent'
      case 'popular': return 'Popular'
      default: return ''
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="input-field pl-10 pr-20"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                "p-1 transition-colors",
                showAdvancedFilters
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            <div className="py-2">
              {/* Group suggestions by type */}
              {Object.entries(
                filteredSuggestions.reduce((groups, suggestion) => {
                  const type = suggestion.type
                  if (!groups[type]) groups[type] = []
                  groups[type].push(suggestion)
                  return groups
                }, {} as Record<string, SearchSuggestion[]>)
              ).map(([type, suggestions]) => (
                <div key={type}>
                  {/* Type Header */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">
                    {getSuggestionTypeLabel(type)}
                  </div>
                  
                  {/* Suggestions */}
                  {suggestions.map((suggestion, index) => {
                    const globalIndex = filteredSuggestions.indexOf(suggestion)
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3",
                          globalIndex === selectedIndex && "bg-gray-50 dark:bg-gray-700"
                        )}
                      >
                        <div className="text-gray-400 dark:text-gray-500">
                          {getSuggestionIcon(suggestion)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {suggestion.title}
                          </div>
                          {suggestion.subtitle && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {suggestion.subtitle}
                            </div>
                          )}
                        </div>
                        {suggestion.category && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {suggestion.category}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          ) : debouncedQuery ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{debouncedQuery}"</p>
              <button
                onClick={handleSearch}
                className="mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Search anyway
              </button>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Start typing to search...</p>
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-40 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Dates
              </label>
              <input
                type="date"
                className="input-field text-sm"
              />
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Group Size
              </label>
              <select className="input-field text-sm">
                <option value="">Any size</option>
                <option value="1-4">1-4 people</option>
                <option value="5-10">5-10 people</option>
                <option value="10+">10+ people</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration
              </label>
              <select className="input-field text-sm">
                <option value="">Any duration</option>
                <option value="1-2">1-2 days</option>
                <option value="3-5">3-5 days</option>
                <option value="6+">6+ days</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSearch()
                setShowAdvancedFilters(false)
              }}
              className="btn-primary text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch
