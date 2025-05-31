import { PaymentMethod } from '~/types/PaymentMethod.type'
import { Voucher } from '~/types/voucher.type'

export function canApplyVoucher(
  voucher: Voucher,
  total: number,
  ids: number[],
  paymentMethod?: PaymentMethod
): boolean {
  const { availableAllProduct, minimumOrder, productIds, paymentMethodAvailable } = voucher
  if (paymentMethod && paymentMethodAvailable !== 'all' && paymentMethod.paymentType !== paymentMethodAvailable) {
    return false
  }
  if (minimumOrder > 0 && total < minimumOrder) {
    return false
  }

  let flag = true
  if (!availableAllProduct && productIds) {
    let applyProductIds = productIds.split(',').map((item) => parseInt(item.trim()))
    ids.forEach((id) => {
      if (!applyProductIds.includes(id)) {
        flag = false
      }
    })
  }
  return flag
}

export function getVoucherDiscount(
  voucher: Voucher,
  total: number,
  ids: number[],
  shipFee: number,
  paymentMethod?: PaymentMethod
) {
  const { maxDiscount, voucherType, discount } = voucher
  let totalDiscount = 0
  if (canApplyVoucher(voucher, total, ids, paymentMethod)) {
    if (voucherType === 'free_ship') {
      totalDiscount = discount * shipFee
    } else {
      totalDiscount = discount * total
    }
  }
  if (maxDiscount > 0) {
    return totalDiscount > maxDiscount ? maxDiscount : totalDiscount
  } else {
    return totalDiscount
  }
}
