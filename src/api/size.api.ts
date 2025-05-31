import http from './http'
import { SuccessResponse } from '~/types/utils.type'
import type { Size } from '~/types/size.type'
const URL_ACTIVE_SIZE = 'public/sizes'
const sizeApi = {
  fetchAll(params?: any) {
    return http.get<SuccessResponse<Size[]>>(URL_ACTIVE_SIZE, { params })
  }
}

export default sizeApi
