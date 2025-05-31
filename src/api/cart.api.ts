import { CartProduct } from '~/types/product.type'
import { SuccessResponse } from '~/types/utils.type'
import http from './http'
const URL_CART = 'cart'

const cartApi = {
  fetchCart() {
    return http.get<SuccessResponse<CartProduct[]>>(URL_CART)
  },
  addToCart(body: CartProduct) {
    return http.post<SuccessResponse<CartProduct>>(URL_CART, body)
  },
  deleteItem(id: number) {
    return http.delete<SuccessResponse<{}>>(URL_CART, { params: { id } })
  },
  deleteManyItems(ids: number[]) {
    return http.delete<SuccessResponse<{}>>(`${URL_CART}/many`, { data: ids })
  },
  buyAgain(body: CartProduct[]) {
    return http.post<SuccessResponse<CartProduct[]>>(`${URL_CART}/many`, body)
  }
}
export default cartApi
