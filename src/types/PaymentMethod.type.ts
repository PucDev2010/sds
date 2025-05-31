export interface PaymentMethod {
  id: number
  paymentType: 'card' | 'cod'
  provider?: string
  name?: string
}
