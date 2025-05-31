import { useTranslation } from 'react-i18next'
import { Link, To, createSearchParams } from 'react-router-dom'
import CancelledIcon from '~/components/CustomIcon/CancelledIcon'
import DeliveredIcon from '~/components/CustomIcon/DeliveredIcon'
import DeliveringIcon from '~/components/CustomIcon/Delivering'
import ProcessingIcon from '~/components/CustomIcon/ProcessingIcon'
import path from '~/constant/path'
import useQueryConfig, { OrderStatus } from '~/hooks/useQueryConfig'

function OrderManageNav() {
  const { t } = useTranslation()
  const queryConfig = useQueryConfig(10)
  const navItems: { to: To; title: string; icon: React.ReactNode; status: string }[] = [
    {
      to: {
        pathname: path.orderManagement,
        search: createSearchParams({ ...queryConfig, orderStatus: OrderStatus.processing, page: '0' }).toString()
      },
      title: t('orderManage:processing'),
      icon: <ProcessingIcon />,
      status: OrderStatus.processing
    },
    {
      to: {
        pathname: path.orderManagement,
        search: createSearchParams({ ...queryConfig, orderStatus: OrderStatus.delivering, page: '0' }).toString()
      },
      title: t('orderManage:delivering'),
      icon: <DeliveringIcon />,
      status: OrderStatus.delivering
    },
    {
      to: {
        pathname: path.orderManagement,
        search: createSearchParams({ ...queryConfig, orderStatus: OrderStatus.delivered, page: '0' }).toString()
      },
      title: t('orderManage:delivered'),
      icon: <DeliveredIcon />,
      status: OrderStatus.delivered
    },
    {
      to: {
        pathname: path.orderManagement,
        search: createSearchParams({ ...queryConfig, orderStatus: OrderStatus.cancelled, page: '0' }).toString()
      },
      title: t('orderManage:cancelled'),
      icon: <CancelledIcon />,
      status: OrderStatus.cancelled
    }
  ]

  return (
    <div className='flex bg-primary px-2 w-full h-full md:px-6 relative py-4 md:py-6 rounded-md'>
      {navItems.map((item, index) => {
        return (
          <Link key={index} className='flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md py-1' to={item.to}>
            <div
              className={`flex text-primary hover:text-pink-600 transition-all flex-col items-center justify-center cursor-pointer ${
                queryConfig?.orderStatus === item.status && 'text-pink-600'
              }`}
              key={index}
            >
              <div className='scale-100 md:scale-150'>{item.icon}</div>
              <div className='text-sm md:text-base'>{item.title}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default OrderManageNav
