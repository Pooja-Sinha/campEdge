import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  Phone,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

interface Certificate {
  id: string
  name: string
  type: 'insurance' | 'license' | 'safety' | 'environmental' | 'medical'
  issuer: string
  issueDate: string
  expiryDate: string
  status: 'valid' | 'expiring' | 'expired'
  documentUrl?: string
}

interface SafetyProtocol {
  id: string
  title: string
  category: 'emergency' | 'equipment' | 'weather' | 'medical' | 'general'
  description: string
  steps: string[]
  lastUpdated: string
  isActive: boolean
}

interface Incident {
  id: string
  title: string
  type: 'injury' | 'equipment' | 'weather' | 'emergency' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  date: string
  location: string
  description: string
  actionsTaken: string[]
  status: 'reported' | 'investigating' | 'resolved' | 'closed'
  reportedBy: string
}

interface EmergencyContact {
  id: string
  name: string
  role: string
  phone: string
  email?: string
  location: string
  availability: '24/7' | 'business_hours' | 'on_call'
  isActive: boolean
}

const SafetyCompliance = () => {
  const [activeTab, setActiveTab] = useState<'certificates' | 'protocols' | 'incidents' | 'contacts'>('certificates')


  // Mock data
  const certificates: Certificate[] = [
    {
      id: 'C001',
      name: 'General Liability Insurance',
      type: 'insurance',
      issuer: 'ABC Insurance Company',
      issueDate: '2024-01-01T00:00:00Z',
      expiryDate: '2025-01-01T00:00:00Z',
      status: 'valid',
      documentUrl: '/documents/insurance.pdf'
    },
    {
      id: 'C002',
      name: 'Adventure Tourism License',
      type: 'license',
      issuer: 'Tourism Department',
      issueDate: '2023-06-15T00:00:00Z',
      expiryDate: '2024-12-15T00:00:00Z',
      status: 'expiring',
      documentUrl: '/documents/license.pdf'
    },
    {
      id: 'C003',
      name: 'First Aid Certification',
      type: 'medical',
      issuer: 'Red Cross Society',
      issueDate: '2024-03-01T00:00:00Z',
      expiryDate: '2024-12-01T00:00:00Z',
      status: 'expiring'
    }
  ]

  const safetyProtocols: SafetyProtocol[] = [
    {
      id: 'P001',
      title: 'Emergency Evacuation Procedure',
      category: 'emergency',
      description: 'Standard procedure for emergency evacuation from camping sites',
      steps: [
        'Assess the situation and determine evacuation necessity',
        'Alert all participants using emergency whistle signals',
        'Guide participants to designated assembly point',
        'Conduct headcount and check for injuries',
        'Contact emergency services if required',
        'Execute evacuation plan to nearest safe location'
      ],
      lastUpdated: '2024-10-15T10:30:00Z',
      isActive: true
    },
    {
      id: 'P002',
      title: 'Equipment Safety Check',
      category: 'equipment',
      description: 'Pre-trip equipment inspection and safety verification',
      steps: [
        'Inspect all climbing and safety equipment',
        'Check tent and camping gear condition',
        'Verify first aid kit completeness',
        'Test communication devices',
        'Document equipment status',
        'Replace or repair faulty equipment'
      ],
      lastUpdated: '2024-11-01T14:20:00Z',
      isActive: true
    }
  ]

  const incidents: Incident[] = [
    {
      id: 'I001',
      title: 'Minor ankle sprain during trek',
      type: 'injury',
      severity: 'low',
      date: '2024-11-10T15:30:00Z',
      location: 'Triund Trek - Kilometer 3',
      description: 'Participant slipped on wet rocks and sustained minor ankle sprain',
      actionsTaken: [
        'Provided immediate first aid',
        'Applied ice pack and bandage',
        'Participant able to continue with support',
        'Monitored condition throughout trip'
      ],
      status: 'resolved',
      reportedBy: 'Guide: Rajesh Kumar'
    },
    {
      id: 'I002',
      title: 'Equipment malfunction - tent zipper',
      type: 'equipment',
      severity: 'low',
      date: '2024-11-08T20:00:00Z',
      location: 'Desert Camp Site A',
      description: 'Tent zipper broke during setup, compromising weather protection',
      actionsTaken: [
        'Temporary repair with safety pins',
        'Relocated participants to backup tent',
        'Equipment marked for replacement',
        'Incident logged for equipment review'
      ],
      status: 'closed',
      reportedBy: 'Camp Manager: Priya Sharma'
    }
  ]

  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'E001',
      name: 'Dr. Amit Verma',
      role: 'Medical Officer',
      phone: '+91-98765-43210',
      email: 'dr.amit@hospital.com',
      location: 'Dharamshala Civil Hospital',
      availability: '24/7',
      isActive: true
    },
    {
      id: 'E002',
      name: 'Rescue Team Alpha',
      role: 'Mountain Rescue',
      phone: '+91-87654-32109',
      location: 'Himachal Pradesh',
      availability: '24/7',
      isActive: true
    },
    {
      id: 'E003',
      name: 'Local Police Station',
      role: 'Law Enforcement',
      phone: '+91-76543-21098',
      location: 'McLeod Ganj Police Station',
      availability: '24/7',
      isActive: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'expiring': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'reported': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Certificates & Documents
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cert.type.charAt(0).toUpperCase() + cert.type.slice(1)} • {cert.issuer}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getStatusColor(cert.status)
                )}>
                  {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                </span>
                <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Issue Date:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(cert.issueDate)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Expiry Date:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(cert.expiryDate)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Days Remaining:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {Math.ceil((new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {cert.documentUrl && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProtocols = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Safety Protocols
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Protocol</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {safetyProtocols.map((protocol) => (
          <div key={protocol.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {protocol.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {protocol.category.charAt(0).toUpperCase() + protocol.category.slice(1)} Protocol
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  protocol.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                )}>
                  {protocol.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {protocol.description}
            </p>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Procedure Steps:
              </h5>
              <ol className="space-y-2">
                {protocol.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {formatDate(protocol.lastUpdated)}
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                  View Details
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Incident Reports
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Report Incident</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {incident.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getSeverityColor(incident.severity)
                  )}>
                    {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)} Severity
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(incident.status)
                  )}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Date & Time:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(incident.date)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {incident.location}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Reported By:</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {incident.reportedBy}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description:
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {incident.description}
              </p>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Actions Taken:
              </h5>
              <ul className="space-y-1">
                {incident.actionsTaken.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                View Full Report
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Update Status
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Emergency Contacts
        </h3>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emergencyContacts.map((contact) => (
          <div key={contact.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {contact.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contact.role}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  contact.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                )}>
                  {contact.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {contact.phone}
                </span>
              </div>
              {contact.email && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {contact.email}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {contact.location}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {contact.availability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Edit
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
            Safety & Compliance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage safety protocols, certifications, and compliance requirements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valid Certificates</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {certificates.filter(c => c.status === 'valid').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {certificates.filter(c => c.status === 'expiring').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Protocols</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {safetyProtocols.filter(p => p.isActive).length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Incidents</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {incidents.filter(i => i.status !== 'closed' && i.status !== 'resolved').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'certificates', label: 'Certificates', icon: FileText },
            { id: 'protocols', label: 'Safety Protocols', icon: Shield },
            { id: 'incidents', label: 'Incident Reports', icon: AlertTriangle },
            { id: 'contacts', label: 'Emergency Contacts', icon: Phone }
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

      {/* Tab Content */}
      {activeTab === 'certificates' && renderCertificates()}
      {activeTab === 'protocols' && renderProtocols()}
      {activeTab === 'incidents' && renderIncidents()}
      {activeTab === 'contacts' && renderContacts()}
    </div>
  )
}

export default SafetyCompliance
