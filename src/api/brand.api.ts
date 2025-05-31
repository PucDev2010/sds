import http from './http'
import { SuccessResponse } from '~/types/utils.type'
import type { Brand } from '~/types/brand.type'
const URL_ACTIVE_BRAND = 'public/brands'
const brandApi = {
  fetchAll(params?: any) {
    return http.get<SuccessResponse<Brand[]>>(URL_ACTIVE_BRAND, { params })
  }
}

export default brandApi
