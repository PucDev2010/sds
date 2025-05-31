import classNames from 'classnames'
import { PercentageOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import { Voucher } from '~/types/voucher.type'
import TruckIcon from '~/components/CustomIcon/TruckIcon'
import { convertTimestamp, formatNumberToSocialStyle } from '~/utils/utils'
function VoucherItem({
  voucher,
  footer,
  children,
  className = ''
}: {
  voucher: Voucher
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  const { end, start, discount, maxDiscount, minimumOrder, voucherType } = voucher
  const isFreeShip = voucherType === 'free_ship'

  return (
    <div className={classNames('relative flex w-full coupon overflow-hidden', className)}>
      <div
        className={classNames(
          'relative coupon-item flex flex-col rounded-md text-white items-center justify-center',
          isFreeShip ? 'bg-teal-500' : 'bg-orange-600'
        )}
      >
        {isFreeShip ? <TruckIcon className='text-2xl' /> : <PercentageOutlined className='text-2xl' />}
        <div className='text-xs italic mt-1 text-center'>
          {isFreeShip ? t('coupon:freeShip') : t('coupon:discount')}
        </div>
        <div className='mt-1 font-semibold'>Foo Store</div>
      </div>
      <div
        className={classNames(
          'flex-1 flex flex-col py-2 ps-2 pe-1  rounded-md  bg-primary bg-gray-50 border border-gray-200 dark:border-gray-700',
          {
            'justify-start': !footer,
            'justify-between': footer
          }
        )}
      >
        <div className={classNames({ 'py-1': !footer })}>Giảm: {discount * 100}%</div>
        <div className={classNames({ 'py-1': !footer })}>
          Đơn tối thiểu: {formatNumberToSocialStyle(minimumOrder, true)} | Giảm tối đa:{' '}
          {maxDiscount ? formatNumberToSocialStyle(maxDiscount, true) : 'Không giới hạn'}
        </div>
        <div className={classNames({ 'py-1': !footer }, 'text-red-500 text-xs ')}>
          Áp dụng: {convertTimestamp(start / 1000)} - {convertTimestamp(end / 1000)}
        </div>
        {footer}
        {children}
      </div>
    </div>
  )
}

export default VoucherItem
