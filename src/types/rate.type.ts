import { Order } from './order.type'
import { Product } from './product.type'

export interface RateOrder {
  ratePoint: number
  content: string
  products: Product[]
  order: Order
}

export interface Rate {
  id: number
  content: string
  username: string
  ratePoint: number
  createdAt: string
}
