import { Rate, RateOrder } from '~/types/rate.type'
import http from './http'
import { SuccessResponse } from '~/types/utils.type'
import { Page } from '~/types/page.type'
import { isNil, isUndefined, omitBy } from 'lodash'
const URL_RATE = 'rating'

export const rateApi = {
  rateOrder(body: RateOrder) {
    return http.post<SuccessResponse<{}>>(URL_RATE, body)
  },
  fetchProductRate({
    productId,
    page,
    size,
    ratePoint
  }: {
    productId: number
    page?: number
    size?: number
    ratePoint?: number
  }) {
    return http.get<SuccessResponse<Page<Rate>>>(`public/rating/${productId}`, {
      params: omitBy({ page, size, ratePoint }, isUndefined)
    })
  }
}
