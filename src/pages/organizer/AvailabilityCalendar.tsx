import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,CheckCircle,
  XCircle} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/format'

interface AvailabilitySlot {
  id: string
  date: string
  campId: string
  campName: string
  isAvailable: boolean
  capacity: number
  bookedSlots: number
  basePrice: number
  dynamicPrice?: number
  priceMultiplier: number
  notes?: string
  restrictions?: string[]
}



const AvailabilityCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [selectedCamp, setSelectedCamp] = useState<string>('all')  //  //  
  const [_showPricingModal, setShowPricingModal] = useState(false)
  const [_showBulkUpdateModal, setShowBulkUpdateModal] = useState(false)

  // Mock data
  const camps = [
    { id: 'C001', name: 'Triund Trek & Camping' },
    { id: 'C002', name: 'Desert Safari Experience' },
    { id: 'C003', name: 'Himalayan Base Camp' }
  ]

  const availabilitySlots: AvailabilitySlot[] = [
    {
      id: 'AS001',
      date: '2024-12-15',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      isAvailable: true,
      capacity: 20,
      bookedSlots: 12,
      basePrice: 3000,
      dynamicPrice: 3600,
      priceMultiplier: 1.2,
      notes: 'Peak season pricing'
    },
    {
      id: 'AS002',
      date: '2024-12-16',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      isAvailable: true,
      capacity: 20,
      bookedSlots: 8,
      basePrice: 3000,
      priceMultiplier: 1.0
    },
    {
      id: 'AS003',
      date: '2024-12-17',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      isAvailable: false,
      capacity: 20,
      bookedSlots: 0,
      basePrice: 3000,
      priceMultiplier: 1.0,
      notes: 'Maintenance day'
    }
  ]  // 

  // const pricingRules: PricingRule[] = [
  //   {
  //     id: 'PR001',
  //     name: 'Winter Peak Season',
  //     type: 'seasonal',
  //     multiplier: 1.3,
  //     startDate: '2024-12-15',
  //     endDate: '2025-01-15',
  //     isActive: true,
  //     description: 'Peak winter season pricing'
  //   },
  //   {
  //     id: 'PR002',
  //     name: 'Weekend Premium',
  //     type: 'weekend',
  //     multiplier: 1.15,
  //     startDate: '2024-01-01',
  //     endDate: '2024-12-31',
  //     isActive: true,
  //     description: 'Weekend pricing premium'
  //   }
  // ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getSlotForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return availabilitySlots.find(slot => 
      slot.date === dateString && 
      (selectedCamp === 'all' || slot.campId === selectedCamp)
    )
  }

  const getDateStatus = (date: Date) => {
    const slot = getSlotForDate(date)
    if (!slot) return 'unavailable'
    if (!slot.isAvailable) return 'blocked'
    if (slot.bookedSlots >= slot.capacity) return 'full'
    if (slot.bookedSlots > slot.capacity * 0.8) return 'limited'
    return 'available'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'full': return 'bg-red-100 text-red-800 border-red-200'
      case 'blocked': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'unavailable': return 'bg-gray-50 text-gray-400 border-gray-100'
      default: return 'bg-gray-50 text-gray-400 border-gray-100'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    if (dateString) {
      setSelectedDate(dateString)
    }
  }

  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) {
      return <div key={index} className="h-24 border border-gray-200 dark:border-gray-700"></div>
    }

    const slot = getSlotForDate(date)
    const status = getDateStatus(date)
    const isToday = date.toDateString() === new Date().toDateString()
    const isSelected = selectedDate === date.toISOString().split('T')[0]

    return (
      <div
        key={index}
        onClick={() => handleDateClick(date)}
        className={cn(
          "h-24 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
          isSelected && "ring-2 ring-primary-500",
          isToday && "bg-blue-50 dark:bg-blue-900/20"
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "text-sm font-medium",
            isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
          )}>
            {date.getDate()}
          </span>
          {slot && (
            <span className={cn(
              "px-1 py-0.5 rounded text-xs font-medium border",
              getStatusColor(status)
            )}>
              {status}
            </span>
          )}
        </div>

        {slot && (
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Users className="w-3 h-3 mr-1" />
              <span>{slot.bookedSlots}/{slot.capacity}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <DollarSign className="w-3 h-3 mr-1" />
              <span>{formatCurrency(slot.dynamicPrice || slot.basePrice)}</span>
            </div>
          </div>
        )}
      </div>
    )
  }  //  //  

  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null

    const slot = availabilitySlots.find(s => s.date === selectedDate)
    const selectedDateObj = new Date(selectedDate)

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedDateObj.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPricingModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
            {slot && (
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                <Trash2 className="w-4 h-4 inline mr-1" />
                Remove
              </button>
            )}
          </div>
        </div>

        {slot ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Availability
              </label>
              <div className="flex items-center space-x-2">
                {slot.isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">
                  {slot.isAvailable ? 'Available' : 'Blocked'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity
              </label>
              <div className="text-sm text-gray-900 dark:text-white">
                {slot.bookedSlots} / {slot.capacity} booked
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(slot.bookedSlots / slot.capacity) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pricing
              </label>
              <div className="text-sm text-gray-900 dark:text-white">
                {slot.dynamicPrice ? (
                  <div>
                    <span className="line-through text-gray-500">{formatCurrency(slot.basePrice)}</span>
                    <span className="ml-2 font-medium">{formatCurrency(slot.dynamicPrice)}</span>
                    <span className="ml-1 text-xs text-green-600">({((slot.priceMultiplier - 1) * 100).toFixed(0)}% up)</span>
                  </div>
                ) : (
                  <span>{formatCurrency(slot.basePrice)}</span>
                )}
              </div>
            </div>

            {slot.notes && (
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {slot.notes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No availability set
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This date is not configured for any camps
            </p>
            <button
              onClick={() => setShowPricingModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Availability
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Availability Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage camp availability, pricing, and capacity
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowBulkUpdateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Bulk Update</span>
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Dates</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Camp</label>
              <select
                value={selectedCamp}
                onChange={(e) => setSelectedCamp(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Camps</option>
                {camps.map(camp => (
                  <option key={camp.id} value={camp.id}>{camp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                View Mode
              </label>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('month')}
                  className={cn(
                    "px-3 py-2 text-sm transition-colors",
                    viewMode === 'month'
                      ? "bg-primary-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                  )}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={cn(
                    "px-3 py-2 text-sm transition-colors",
                    viewMode === 'week'
                      ? "bg-primary-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                  )}
                >
                  Week
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Limited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Full</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-100 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Not Set</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((date, index) => renderCalendarDay(date, index))}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          {renderSelectedDateDetails()}
        </div>
      </div>
    </div>
  )
}

export default AvailabilityCalendar
