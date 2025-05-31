import { Order, OrderDTO, OrderSuccessResponse } from '~/types/order.type'
import http from './http'
import { SuccessResponse, VnpayQueryDR } from '~/types/utils.type'
import { QueryConfig } from '~/hooks/useQueryConfig'
import { Page } from '~/types/page.type'
const URL_ORDER = 'orders'
const URL_CANCEL_ORDER = 'orders/cancel'
const orderApi = {
  createOrder(body: OrderDTO) {
    return http.post<SuccessResponse<OrderSuccessResponse>>(URL_ORDER, body)
  },
  fetchOrder(queryConfig: QueryConfig) {
    return http.get<SuccessResponse<Page<Order>>>(URL_ORDER, { params: queryConfig })
  },
  cancelOrder(orderId: number) {
    return http.put<SuccessResponse<{}>>(`${URL_CANCEL_ORDER}/${orderId}`)
  },
  fetchPaymentUrl(orderId: number) {
    return http.get<SuccessResponse<OrderSuccessResponse>>('public/vnpay-payment/' + orderId)
  },
  queryTransaction(orderId: number) {
    return http.get<SuccessResponse<VnpayQueryDR>>('vnpay-querydr/' + orderId)
  }
}

export default orderApi
