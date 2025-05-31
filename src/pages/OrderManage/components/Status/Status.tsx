import { useTranslation } from 'react-i18next'
import CancelledIcon from '~/components/CustomIcon/CancelledIcon'
import DeliveredIcon from '~/components/CustomIcon/DeliveredIcon'
import DeliveringIcon from '~/components/CustomIcon/Delivering'
import ProcessingIcon from '~/components/CustomIcon/ProcessingIcon'
import { OrderStatus } from '~/hooks/useQueryConfig'
import { normalizeKey } from '~/utils/utils'
function Status({ orderStatus }: { orderStatus: string }) {
  const { t } = useTranslation()
  if (orderStatus === OrderStatus.processing) {
    return (
      <div className='flex items-center text-teal-600'>
        <ProcessingIcon />
        <span className='ms-2'>{t(normalizeKey(`orderManage:${orderStatus}`))}</span>
      </div>
    )
  } else if (orderStatus === OrderStatus.delivering) {
    return (
      <div className='flex items-center text-teal-600'>
        <DeliveringIcon />
        <span className='ms-2'>{t(normalizeKey(`orderManage:${orderStatus}`))}</span>
      </div>
    )
  } else if (orderStatus === OrderStatus.delivered) {
    return (
      <div className='flex items-center text-teal-600'>
        <DeliveredIcon />
        <span className='ms-2'>{t(normalizeKey(`orderManage:${orderStatus}`))}</span>
      </div>
    )
  } else {
    return (
      <div className='flex items-center text-teal-600'>
        <CancelledIcon />
        <span className='ms-2'>{t(normalizeKey(`orderManage:${orderStatus}`))}</span>
      </div>
    )
  }
}

export default Status
