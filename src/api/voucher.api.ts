import { SuccessResponse } from '~/types/utils.type'
import http from './http'
import { Voucher } from '~/types/voucher.type'

const voucherApi = {
  checkVoucher(code: string) {
    return http.get<SuccessResponse<Voucher>>('receive-vouchers/user', { params: { code } })
  },
  getAvailableVoucher() {
    return http.get<SuccessResponse<Voucher[]>>('public/vouchers')
  },
  getVoucherByUser(params: {}) {
    return http.get<SuccessResponse<Voucher[]>>('vouchers/user', { params })
  },
  recievedVouher(code: string) {
    return http.get<SuccessResponse<Voucher>>('receive-vouchers/user', { params: { code } })
  }
}

export default voucherApi
