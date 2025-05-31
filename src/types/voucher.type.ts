export interface Voucher {
  id: number
  code: string
  start: number
  end: number
  discount: number
  maxDiscount: number
  minimumOrder: number
  voucherType: 'free_ship' | 'discount'
  availableAllProduct: boolean
  availableAllUser: boolean
  paymentMethodAvailable: 'all' | 'cod' | 'card'
  productIds?: string
  description?: string
  avaiable?: boolean
}
