import { ProductAttribute } from '~/types/product.attribute.type'

export const getProductAttributePrice = (attr: ProductAttribute) => {
  let { discount, price } = attr
  if (discount) {
    return price * (1 - discount)
  }
  return price
}
