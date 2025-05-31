import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import CouponIcon from '~/components/CustomIcon/Coupon'
import ApplyVoucher from '~/components/ApplyVoucher'
import { CartProduct } from '~/types/product.type'
import { Voucher } from '~/types/voucher.type'
import { getProductAttributePrice } from '~/utils/product.utils'
import { PaymentMethod } from '~/types/PaymentMethod.type'

function OrderVoucher({
  voucher,
  onChangeVoucher,
  orderItemDTOS,
  paymentMethod
}: {
  voucher?: Voucher
  onChangeVoucher: (voucher: Voucher) => void
  orderItemDTOS: CartProduct[]
  paymentMethod?: PaymentMethod
}) {
  const { t } = useTranslation()
  const total = useMemo(() => {
    return orderItemDTOS.reduce(
      (prev, curr) => prev + curr.quantity * getProductAttributePrice(curr.productAttribute),
      0
    )
  }, [])

  const productIds = useMemo(() => {
    return orderItemDTOS.map((item) => item.product.id)
  }, [])

  return (
    <div className='flex justify-between bg-primary items-center'>
      <div>
        <div className='px-1 md:px-8 my-2 flex items-center'>
          <span className='text-blue-600 text-lg'>
            <CouponIcon />
          </span>
          <span className='text-base text-blue-600 inline-block mx-2 '>{t('common:voucher')}:</span>
          {voucher && (
            <span className='text-base text-blue-600 inline-block mx-2 '>{t('purchase:applyOneVoucher')}</span>
          )}
        </div>
        {voucher && !voucher?.avaiable && (
          <div className='px-1 md:px-8 my-2 text-sm text-red-500'>{t('purchase:canNotUseVoucher')}</div>
        )}
      </div>
      <ApplyVoucher
        total={total}
        selectedProductIds={productIds}
        selectedVoucher={voucher}
        onSelectedVoucher={(voucher) => {
          onChangeVoucher(voucher)
        }}
        paymentMethod={paymentMethod}
      />
    </div>
  )
}

export default OrderVoucher
