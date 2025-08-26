// Payment Service - Mock implementation simulating Razorpay/Stripe integration
// In production, this would integrate with actual payment gateways

export interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet'
  name: string
  icon: string
  description: string
  processingTime: string
  fees?: number
}

export interface PaymentDetails {
  amount: number
  currency: string
  description: string
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId: string
  amount: number
  method: string
  timestamp: string
  error?: string
  receipt?: string
}

export interface PaymentSession {
  sessionId: string
  amount: number
  currency: string
  expiresAt: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
}

class PaymentService {
  private apiKey: string = process.env.REACT_APP_PAYMENT_API_KEY || 'mock-payment-key'
  private baseUrl: string = 'https://api.razorpay.com/v1'

  // Available payment methods in India
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
      processingTime: 'Instant',
      fees: 2.5
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm',
      processingTime: 'Instant',
      fees: 0
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks',
      processingTime: 'Instant',
      fees: 1.5
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Digital Wallet',
      icon: '💰',
      description: 'Paytm, Amazon Pay, etc.',
      processingTime: 'Instant',
      fees: 1.0
    }
  ]

  // Get available payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.paymentMethods
  }

  // Create payment session
  async createPaymentSession(details: PaymentDetails): Promise<PaymentSession> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    return {
      sessionId,
      amount: details.amount,
      currency: details.currency,
      expiresAt,
      status: 'pending'
    }
  }

  // Process payment
  async processPayment(
    sessionId: string,
    paymentMethod: string,
    paymentData: any
  ): Promise<PaymentResult> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate random payment failures (10% chance)
    const shouldFail = Math.random() < 0.1

    if (shouldFail) {
      return {
        success: false,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        error: this.getRandomError()
      }
    }

    // Successful payment
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const receipt = `rcpt_${Date.now()}`

    return {
      success: true,
      paymentId,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      method: paymentMethod,
      timestamp: new Date().toISOString(),
      receipt
    }
  }

  // Verify payment (for webhook simulation)
  async verifyPayment(paymentId: string): Promise<PaymentResult | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // In real implementation, this would verify with payment gateway
    return {
      success: true,
      paymentId,
      orderId: `order_${Date.now()}`,
      amount: 5000,
      method: 'upi',
      timestamp: new Date().toISOString(),
      receipt: `rcpt_${Date.now()}`
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // Mock status based on payment ID
    if (paymentId.includes('fail')) return 'failed'
    if (paymentId.includes('pending')) return 'pending'
    if (paymentId.includes('processing')) return 'processing'
    return 'completed'
  }

  // Calculate total amount including fees
  calculateTotalAmount(baseAmount: number, paymentMethod: string): {
    baseAmount: number
    fees: number
    totalAmount: number
    breakdown: Array<{ label: string; amount: number }>
  } {
    const method = this.paymentMethods.find(m => m.id === paymentMethod)
    const feePercentage = method?.fees || 0
    const fees = Math.round((baseAmount * feePercentage) / 100)
    const totalAmount = baseAmount + fees

    const breakdown = [
      { label: 'Camp Booking', amount: baseAmount },
      ...(fees > 0 ? [{ label: 'Payment Processing Fee', amount: fees }] : [])
    ]

    return {
      baseAmount,
      fees,
      totalAmount,
      breakdown
    }
  }

  // Simulate UPI payment flow
  async initiateUPIPayment(details: PaymentDetails): Promise<{
    qrCode: string
    upiLink: string
    paymentId: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const paymentId = `upi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const upiId = 'campindia@paytm'
    const amount = details.amount
    const note = encodeURIComponent(details.description)

    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${upiId}&pn=CampIndia&am=${amount}&cu=INR&tn=${note}`
    
    // Mock QR code (in real app, would generate actual QR code)
    const qrCode = `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">
          QR Code for ₹${amount}
        </text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="10">
          Scan with any UPI app
        </text>
      </svg>
    `)}`

    return {
      qrCode,
      upiLink,
      paymentId
    }
  }

  // Simulate card payment flow
  async processCardPayment(cardDetails: {
    number: string
    expiry: string
    cvv: string
    name: string
  }, amount: number): Promise<PaymentResult> {
    // Simulate card validation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Basic card validation
    if (!this.validateCard(cardDetails)) {
      return {
        success: false,
        orderId: `order_${Date.now()}`,
        amount,
        method: 'card',
        timestamp: new Date().toISOString(),
        error: 'Invalid card details'
      }
    }

    // Simulate 3D Secure authentication
    const requires3DS = Math.random() < 0.3 // 30% chance
    if (requires3DS) {
      // In real app, would redirect to bank's 3D Secure page
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Process payment
    return this.processPayment('mock_session', 'card', {
      orderId: `order_${Date.now()}`,
      amount
    })
  }

  // Get refund status
  async getRefundStatus(paymentId: string): Promise<{
    refundId?: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    amount: number
    reason?: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      refundId: `rfnd_${Date.now()}`,
      status: 'completed',
      amount: 5000,
      reason: 'Booking cancelled by user'
    }
  }

  // Private helper methods
  private validateCard(cardDetails: {
    number: string
    expiry: string
    cvv: string
    name: string
  }): boolean {
    // Basic validation
    const cardNumber = cardDetails.number.replace(/\s/g, '')
    if (cardNumber.length < 13 || cardNumber.length > 19) return false
    if (!/^\d+$/.test(cardNumber)) return false
    if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) return false
    if (!cardDetails.name.trim()) return false

    // Expiry validation
    const [month, year] = cardDetails.expiry.split('/')
    if (!month || !year) return false
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    if (expiry < new Date()) return false

    return true
  }

  private getRandomError(): string {
    const errors = [
      'Insufficient funds in account',
      'Card declined by bank',
      'Transaction limit exceeded',
      'Invalid CVV',
      'Card expired',
      'Network error, please try again',
      'Bank server temporarily unavailable'
    ]
    return errors[Math.floor(Math.random() * errors.length)]
  }

  // Mock webhook handler
  async handleWebhook(payload: any): Promise<void> {
    // In real app, would verify webhook signature and process payment updates
    console.log('Payment webhook received:', payload)
  }
}

export const paymentService = new PaymentService()
