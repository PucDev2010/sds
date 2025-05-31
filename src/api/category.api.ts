import { Category } from '~/types/category.type'
import http from './http'
import { SuccessResponse } from '~/types/utils.type'

const URL_ACTIVE_CATEGORY = 'public/categories'
const categoryApi = {
  fetchAll(params?: any) {
    return http.get<SuccessResponse<Category[]>>(URL_ACTIVE_CATEGORY, { params })
  }
}

export default categoryApi
