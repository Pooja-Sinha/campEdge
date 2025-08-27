import {
  Image,
  Upload,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  Grid,
  List,
  Plus,
  Camera,
  Play,
  FileText,
  Star,
  MoreVertical
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'document'
  title: string
  url: string
  thumbnail?: string
  size: number
  uploadDate: string
  campId?: string
  campName?: string
  category: 'landscape' | 'accommodation' | 'activity' | 'food' | 'group' | 'promotional'
  tags: string[]
  isPublic: boolean
  isPrimary?: boolean
}

interface VirtualTour {
  id: string
  title: string
  campId: string
  campName: string
  scenes: number
  views: number
  createdDate: string
  isActive: boolean
}

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState<'media' | 'tours' | 'bulk'>('media')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'landscape' | 'accommodation' | 'activity' | 'food' | 'group' | 'promotional'>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Mock data
  const mediaItems: MediaItem[] = [
    {
      id: 'M001',
      type: 'image',
      title: 'Triund Trek Sunrise View',
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop',
      size: 2.5 * 1024 * 1024, // 2.5MB
      uploadDate: '2024-11-15T10:30:00Z',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      category: 'landscape',
      tags: ['sunrise', 'mountain', 'trek'],
      isPublic: true,
      isPrimary: true
    },
    {
      id: 'M002',
      type: 'video',
      title: 'Desert Safari Adventure',
      url: 'https://example.com/video.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop',
      size: 15.8 * 1024 * 1024, // 15.8MB
      uploadDate: '2024-11-14T15:20:00Z',
      campId: 'C002',
      campName: 'Desert Safari Experience',
      category: 'activity',
      tags: ['desert', 'safari', 'adventure'],
      isPublic: true
    },
    {
      id: 'M003',
      type: 'image',
      title: 'Camping Setup',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      size: 1.8 * 1024 * 1024, // 1.8MB
      uploadDate: '2024-11-13T09:45:00Z',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      category: 'accommodation',
      tags: ['camping', 'tent', 'setup'],
      isPublic: false
    }
  ]

  const virtualTours: VirtualTour[] = [
    {
      id: 'VT001',
      title: 'Triund Base Camp 360° Tour',
      campId: 'C001',
      campName: 'Triund Trek & Camping',
      scenes: 8,
      views: 1250,
      createdDate: '2024-11-10T10:30:00Z',
      isActive: true
    },
    {
      id: 'VT002',
      title: 'Desert Camp Experience',
      campId: 'C002',
      campName: 'Desert Safari Experience',
      scenes: 6,
      views: 890,
      createdDate: '2024-11-08T15:20:00Z',
      isActive: true
    }
  ]

  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'landscape': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'accommodation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'activity': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'food': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'group': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'promotional': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    setSelectedItems(
      selectedItems.length === filteredMediaItems.length 
        ? [] 
        : filteredMediaItems.map(item => item.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for items:', selectedItems)
  }

  const renderMediaGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredMediaItems.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
          {/* Media Preview */}
          <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
            <img
              src={item.thumbnail || item.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItemSelection(item.id)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="absolute top-2 right-2">
              {item.type === 'video' && (
                <div className="bg-black bg-opacity-50 rounded-full p-2">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
              {item.isPrimary && (
                <div className="bg-yellow-500 rounded-full p-1 ml-1">
                  <Star className="w-3 h-3 text-white fill-current" />
                </div>
              )}
            </div>
            <div className="absolute bottom-2 left-2">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getCategoryColor(item.category)
              )}>
                {item.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate">
              {item.title}
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {item.campName}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{formatFileSize(item.size)}</span>
              <span>{formatDate(item.uploadDate)}</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors" title="View">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-green-600 hover:text-green-700 transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-purple-600 hover:text-purple-700 transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1 text-red-600 hover:text-red-700 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                item.isPublic ? "bg-green-500" : "bg-gray-400"
              )} title={item.isPublic ? "Public" : "Private"} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMediaList = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredMediaItems.length && filteredMediaItems.length > 0}
                  onChange={selectAllItems}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Media
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Camp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMediaItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        {item.title}
                        {item.isPrimary && <Star className="w-4 h-4 text-yellow-500 fill-current ml-1" />}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {item.campName}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getCategoryColor(item.category)
                  )}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {formatFileSize(item.size)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {formatDate(item.uploadDate)}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    item.isPublic 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  )}>
                    {item.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:text-green-700 transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-purple-600 hover:text-purple-700 transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-700 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="More">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderVirtualTours = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Virtual Tours
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Tour</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {virtualTours.map((tour) => (
          <div key={tour.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {tour.title}
              </h4>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Camp:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tour.campName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Scenes:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tour.scenes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Views:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tour.views.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  tour.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                )}>
                  {tour.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                View Tour
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your media, virtual tours, and promotional content
          </p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'media', label: 'Media Library', icon: Image },
            { id: 'tours', label: 'Virtual Tours', icon: Camera },
            { id: 'bulk', label: 'Bulk Operations', icon: Upload }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Media Library Tab */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="landscape">Landscape</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="activity">Activity</option>
                  <option value="food">Food</option>
                  <option value="group">Group</option>
                  <option value="promotional">Promotional</option>
                </select>
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "px-3 py-2 transition-colors",
                      viewMode === 'grid'
                        ? "bg-primary-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-2 transition-colors",
                      viewMode === 'list'
                        ? "bg-primary-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-400">
                    {selectedItems.length} item(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('download')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleBulkAction('public')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      Make Public
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Media Content */}
          {viewMode === 'grid' ? renderMediaGrid() : renderMediaList()}

          {/* Empty State */}
          {filteredMediaItems.length === 0 && (
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No media found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search criteria' : 'Upload your first media files to get started'}
              </p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Media</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Virtual Tours Tab */}
      {activeTab === 'tours' && renderVirtualTours()}

      {/* Bulk Operations Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bulk Operations
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload multiple files, resize images, and perform batch operations on your media library.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors group">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Bulk Upload
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Upload multiple files at once
              </div>
            </button>

            <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors group">
              <Image className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Resize Images
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Batch resize and optimize
              </div>
            </button>

            <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors group">
              <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Import from CSV
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Import metadata from file
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentManagement
