import { Brand } from './brand.type'
import { Category } from './category.type'
import { PageQueryParam } from './page.type'
import { ProductAttribute } from './product.attribute.type'
import { ProductDescription } from './product.description'
import { ProductImage } from './product.images'

export interface Product {
  id: number
  name: string
  minPrice: number
  maxPrice: number
  salePercent: number
  rate: number
  totalRate: number
  sku: string
  sold: number
  thumbnail: string
  shortDescription: string
  deleted: boolean
  weight: number
  category: Category
  brand: Brand
  productAttributes?: ProductAttribute[]
  productImages?: ProductImage[]
  productDescription?: ProductDescription
}

export interface CartProduct {
  id?: number
  quantity: number
  productAttribute: ProductAttribute
  product: Product
}
