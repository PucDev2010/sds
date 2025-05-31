import { SuccessResponse } from '~/types/utils.type'
import http from './http'
import { Product } from '~/types/product.type'
import { Page } from '~/types/page.type'
import { QueryConfig } from '~/hooks/useQueryConfig'

const URL_PRODUCT = 'public/products'
const URL_PRODUCT_FILTER = 'public/products/filter'

const productApi = {
  fetchProductById(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL_PRODUCT}/${id}`)
  },
  filterProducts(params: QueryConfig) {
    return http.get<SuccessResponse<Page<Product>>>(URL_PRODUCT_FILTER, { params })
  },
  fetchProductByVoucher(ids: string) {
    return http.get<SuccessResponse<Product[]>>('public/products-voucher', { params: { ids } })
  }
}

export default productApi
