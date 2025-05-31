import { Voucher } from '~/types/voucher.type'
import { convertTimestamp, getAvailablePaymentMethod } from '~/utils/utils'
import VoucherItem from '../VoucherItem/VoucherItem'
import { Link } from 'react-router-dom'
import path from '~/constant/path'

function VoucherItemDetail({ voucher, footer }: { voucher: Voucher; footer?: React.ReactNode }) {
  return (
    <div className='mt-6 pb-4'>
      <VoucherItem voucher={voucher} />
      <div className='font-semibold my-2'>Hạn sử dụng mã</div>
      <div className='text-red-500 text-xs'>
        {convertTimestamp(voucher.start / 1000)} - {convertTimestamp(voucher.end / 1000)}
      </div>
      <div className='font-semibold my-2'>Thanh toán</div>
      <div>{getAvailablePaymentMethod(voucher.paymentMethodAvailable)}</div>
      <div className='font-semibold my-2'>Sản phẩm áp dụng</div>
      <div className='flex'>
        {voucher.availableAllProduct ? 'Tất cả sản phẩm' : 'Một số sản phẩm'}{' '}
        {!voucher.availableAllProduct && (
          <Link to={path.productVoucher} state={{ voucher }}>
            <div className='underline ms-2'>Xem ngay</div>
          </Link>
        )}
      </div>
      <div className='font-semibold my-2'>Chi tiết</div>
      <div>{voucher.description}</div>
      {footer}
    </div>
  )
}

export default VoucherItemDetail
