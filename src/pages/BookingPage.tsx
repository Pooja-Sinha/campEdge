import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Plus,
  Trash2,
  AlertCircle,
  Shield,
  Clock
} from 'lucide-react'
import { useCamp } from '../hooks/useCamps'
import { useIsAuthenticated } from '../hooks/useAuth'
import { bookingApi } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatDate, formatDuration } from '../utils/format'
import { cn } from '../utils/cn'

// Validation schemas
const participantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1, 'Age is required').max(100, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  medicalConditions: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
})

const bookingSchema = z.object({
  participants: z.array(participantSchema).min(1, 'At least one participant is required'),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    relation: z.string().min(2, 'Relationship is required'),
  }),
  specialRequests: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
  agreeToPolicy: z.boolean().refine(val => val === true, 'You must agree to cancellation policy'),
})

type BookingFormData = z.infer<typeof bookingSchema>

const BookingPage = () => {
  const { campId } = useParams<{ campId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingId, setBookingId] = useState<string>('')

  const slotId = searchParams.get('slot')
  const participantCount = parseInt(searchParams.get('participants') || '1')

  const { isAuthenticated, user } = useIsAuthenticated()
  const { data: campResponse, isLoading } = useCamp(campId!)

  const camp = campResponse?.success ? campResponse.data : null
  const selectedSlot = camp?.availability.slots.find(slot => slot.id === slotId)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: Array.from({ length: participantCount }, () => ({
        name: '',
        age: 25,
        gender: 'male' as const,
        email: '',
        phone: '',
        medicalConditions: '',
        dietaryRestrictions: '',
      })),
      emergencyContact: {
        name: '',
        phone: '',
        relation: '',
      },
      specialRequests: '',
      agreeToTerms: false,
      agreeToPolicy: false,
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants'
  })

  const watchedParticipants = watch('participants')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Pre-fill first participant with user data
  useEffect(() => {
    if (user && fields.length > 0) {
      setValue('participants.0.name', user.name)
      setValue('participants.0.email', user.email)
    }
  }, [user, fields.length, setValue])

  const totalPrice = selectedSlot ? selectedSlot.price * watchedParticipants.length : 0

  const steps = [
    { id: 1, title: 'Participants', description: 'Add participant details' },
    { id: 2, title: 'Emergency Contact', description: 'Emergency contact information' },
    { id: 3, title: 'Review & Payment', description: 'Review booking and pay' },
  ]

  const nextStep = async () => {
    let fieldsToValidate: string[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['participants']
    } else if (currentStep === 2) {
      fieldsToValidate = ['emergencyContact']
    }

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid) {
      setCurrentStep(prev => Math.min(3, prev + 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!camp || !selectedSlot || !user) return

    setIsSubmitting(true)
    try {
      const bookingData = {
        userId: user.id,
        campId: camp.id,
        slotId: selectedSlot.id,
        participants: data.participants,
        totalAmount: totalPrice,
        paidAmount: totalPrice,
        paymentStatus: 'paid' as const,
        bookingStatus: 'confirmed' as const,
        specialRequests: data.specialRequests,
        emergencyContact: data.emergencyContact,
      }

      const response = await bookingApi.createBooking(bookingData)

      if (response.success) {
        setBookingId(response.data.id)
        setBookingComplete(true)
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading booking details..." />
      </div>
    )
  }

  if (!camp || !selectedSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking information is invalid or expired.
          </p>
          <button
            onClick={() => navigate('/camps')}
            className="btn-primary"
          >
            Browse Camps
          </button>
        </div>
      </div>
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your booking for {camp.title} has been confirmed. You'll receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Booking ID</div>
            <div className="font-mono font-semibold text-gray-900 dark:text-white">
              {bookingId}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full btn-primary"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/camps')}
              className="w-full btn-secondary"
            >
              Browse More Camps
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max section-padding py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Book Your Adventure
            </h1>

            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                      currentStep >= step.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    )}>
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <div className={cn(
                        "font-medium",
                        currentStep >= step.id
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 h-0.5 mx-4",
                      currentStep > step.id
                        ? "bg-primary-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Participants */}
                {currentStep === 1 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Participant Details
                      </h2>
                      <button
                        type="button"
                        onClick={() => append({
                          name: '',
                          age: 25,
                          gender: 'male',
                          email: '',
                          phone: '',
                          medicalConditions: '',
                          dietaryRestrictions: '',
                        })}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Participant</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Participant {index + 1}
                              {index === 0 && user && (
                                <span className="ml-2 text-sm text-primary-600">(You)</span>
                              )}
                            </h3>
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name *
                              </label>
                              <input
                                {...register(`participants.${index}.name`)}
                                className="input-field"
                                placeholder="Enter full name"
                              />
                              {errors.participants?.[index]?.name && (
                                <p className="text-red-600 text-sm mt-1">
                                  {errors.participants[index]?.name?.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Age *
                              </label>
                              <input
                                type="number"
                                {...register(`participants.${index}.age`, { valueAsNumber: true })}
                                className="input-field"
                                placeholder="Age"
                                min="1"
                                max="100"
                              />
                              {errors.participants?.[index]?.age && (
                                <p className="text-red-600 text-sm mt-1">
                                  {errors.participants[index]?.age?.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Gender *
                              </label>
                              <select
                                {...register(`participants.${index}.gender`)}
                                className="input-field"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email *
                              </label>
                              <input
                                type="email"
                                {...register(`participants.${index}.email`)}
                                className="input-field"
                                placeholder="email@example.com"
                              />
                              {errors.participants?.[index]?.email && (
                                <p className="text-red-600 text-sm mt-1">
                                  {errors.participants[index]?.email?.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                {...register(`participants.${index}.phone`)}
                                className="input-field"
                                placeholder="+91-9876543210"
                              />
                              {errors.participants?.[index]?.phone && (
                                <p className="text-red-600 text-sm mt-1">
                                  {errors.participants[index]?.phone?.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Medical Conditions
                              </label>
                              <input
                                {...register(`participants.${index}.medicalConditions`)}
                                className="input-field"
                                placeholder="Any medical conditions (optional)"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dietary Restrictions
                              </label>
                              <input
                                {...register(`participants.${index}.dietaryRestrictions`)}
                                className="input-field"
                                placeholder="Any dietary restrictions (optional)"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Emergency Contact */}
                {currentStep === 2 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Emergency Contact
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Name *
                        </label>
                        <input
                          {...register('emergencyContact.name')}
                          className="input-field"
                          placeholder="Emergency contact name"
                        />
                        {errors.emergencyContact?.name && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.emergencyContact.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register('emergencyContact.phone')}
                          className="input-field"
                          placeholder="+91-9876543210"
                        />
                        {errors.emergencyContact?.phone && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.emergencyContact.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Relationship *
                        </label>
                        <input
                          {...register('emergencyContact.relation')}
                          className="input-field"
                          placeholder="e.g., Father, Mother, Spouse, Friend"
                        />
                        {errors.emergencyContact?.relation && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.emergencyContact.relation.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        {...register('specialRequests')}
                        rows={4}
                        className="input-field"
                        placeholder="Any special requests or requirements (optional)"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Booking Summary
                      </h2>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Camp</span>
                          <span className="font-medium text-gray-900 dark:text-white">{camp.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Dates</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatDate(selectedSlot.startDate)} - {formatDate(selectedSlot.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatDuration(camp.duration.days, camp.duration.nights)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Participants</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {watchedParticipants.length} person{watchedParticipants.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span className="text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-gray-900 dark:text-white">{formatCurrency(totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Terms & Conditions
                      </h3>

                      <div className="space-y-4">
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register('agreeToTerms')}
                            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            I agree to the{' '}
                            <a href="/terms" className="text-primary-600 hover:text-primary-700">
                              Terms and Conditions
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="text-red-600 text-sm">{errors.agreeToTerms.message}</p>
                        )}

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register('agreeToPolicy')}
                            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            I understand and agree to the{' '}
                            <a href="/cancellation" className="text-primary-600 hover:text-primary-700">
                              Cancellation Policy
                            </a>
                          </span>
                        </label>
                        {errors.agreeToPolicy && (
                          <p className="text-red-600 text-sm">{errors.agreeToPolicy.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Payment Information</span>
                      </h3>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-400">
                          <Shield className="w-5 h-5" />
                          <span className="font-medium">Secure Payment Simulation</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                          This is a demo booking system. No actual payment will be processed.
                          Your booking will be confirmed instantly for testing purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  {/* Camp Info */}
                  <div className="mb-6">
                    <img
                      src={camp.images.find(img => img.isPrimary)?.url}
                      alt={camp.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {camp.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{camp.location.name}, {camp.location.state}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(selectedSlot.startDate)} - {formatDate(selectedSlot.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(camp.duration.days, camp.duration.nights)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{watchedParticipants.length} participant{watchedParticipants.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Price Breakdown
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatCurrency(selectedSlot.price)} × {watchedParticipants.length} person{watchedParticipants.length > 1 ? 's' : ''}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>

                      {/* Group Discount */}
                      {camp.pricing.groupDiscounts.length > 0 && watchedParticipants.length >= camp.pricing.groupDiscounts[0].minSize && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Group discount ({camp.pricing.groupDiscounts[0].discountPercentage}% off)</span>
                          <span>
                            -{formatCurrency(totalPrice * camp.pricing.groupDiscounts[0].discountPercentage / 100)}
                          </span>
                        </div>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(
                              camp.pricing.groupDiscounts.length > 0 && watchedParticipants.length >= camp.pricing.groupDiscounts[0].minSize
                                ? totalPrice * (1 - camp.pricing.groupDiscounts[0].discountPercentage / 100)
                                : totalPrice
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {camp.pricing.includes.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {camp.pricing.includes.length > 4 && (
                        <li className="text-sm text-gray-500 dark:text-gray-400">
                          +{camp.pricing.includes.length - 4} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Cancellation Policy
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {camp.pricing.cancellationPolicy}
                    </p>
                  </div>

                  {/* Security Features */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secure payment processing</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span>24/7 customer support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4 text-green-500" />
                        <span>Instant booking confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Info */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-6">
                  <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Emergency Contact</span>
                  </h4>
                  {camp.emergencyContacts.map((contact, index) => (
                    <div key={index} className="text-sm text-red-700 dark:text-red-300">
                      <div className="font-medium">{contact.name}</div>
                      <div>{contact.role}</div>
                      <a href={`tel:${contact.phone}`} className="font-medium hover:underline">
                        {contact.phone}
                      </a>
                      {contact.available24x7 && (
                        <div className="text-xs text-red-600 dark:text-red-400">Available 24/7</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
