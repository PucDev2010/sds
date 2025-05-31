import http from './http'
import { SuccessResponse } from '~/types/utils.type'
import { Color } from '~/types/color.type'
const URL_ACTIVE_COLOR = 'public/colors'
const colorApi = {
  fetchAll(params?: any) {
    return http.get<SuccessResponse<Color[]>>(URL_ACTIVE_COLOR, { params })
  }
}

export default colorApi
