import { Brand } from './brand.type'
import { Category } from './category.type'
import { Color } from './color.type'
import { Size } from './size.type'

export interface CommonData {
  categories?: Category[]
  brands?: Brand[]
  colors?: Color[]
  sizes?: Size[]
}
export const initialCommonData = {
  categories: [],
  brands: [],
  colors: [],
  sizes: []
}
