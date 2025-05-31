import { Color } from './color.type'
import { Size } from './size.type'

export interface ProductAttribute {
  id: number
  price: number
  discount?: number
  stock: number
  selled?: number
  color: Color
  size: Size
}
