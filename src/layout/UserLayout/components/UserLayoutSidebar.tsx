import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom'

import { User } from '~/types/user.type'
import path from '~/constant/path'
import AddressBookIcon from '~/components/CustomIcon/AddressBookIcon'
import OrderIcon from '~/components/CustomIcon/OrderIcon'
import PasswordIcon from '~/components/CustomIcon/PasswordIcon'
import { RootState } from '~/store/store'
import ActiveRoute from '~/components/ActiveRoute'
import MeAvatar from '~/components/MeAvatar/MeAvatar'
import useQueryConfig, { OrderStatus } from '~/hooks/useQueryConfig'
import useLogout from '~/hooks/useLogout'
import CouponIcon from '~/components/CustomIcon/Coupon'

function UserLayoutSidebar() {
  const { profile } = useSelector((root: RootState) => root.user)
  const { firstName, lastName } = profile as User
  const { t } = useTranslation()
  const queryConfig = useQueryConfig(6)
  const { doLogout } = useLogout()
  const items = [
    {
      title: t('meLayout:navMe'),
      icon: <UserOutlined />,
      to: path.me
    },
    {
      title: t('meLayout:navAddress'),
      icon: <AddressBookIcon />,
      to: path.address
    },
    {
      title: t('meLayout:navOrderManagement'),
      icon: <OrderIcon />,
      to: {
        pathname: path.orderManagement,
        search: createSearchParams({ ...queryConfig, orderStatus: OrderStatus.processing }).toString()
      }
    },
    {
      title: t('meLayout:navChangePassword'),
      icon: <PasswordIcon />,
      to: path.changePassword
    },
    {
      title: t('meLayout:navVoucher'),
      icon: <CouponIcon />,
      to: path.userVoucher
    }
  ]

  return (
    <div className='bg-primary rounded-md py-6 px-2'>
      <div className='flex items-center pb-4 flex-col'>
        <MeAvatar />
        <div className='mt-2 text-base font-semibold text-primary'>
          {firstName || lastName ? `${firstName} ${lastName}` : ''}
        </div>
      </div>
      <div className='nav-link'>
        {items.map(({ title, icon, to }, index) => {
          return (
            <ActiveRoute key={index} to={to}>
              <div className='flex py-3 px-2 border-t items-center rounded-sm text-base transition-all hover:bg-gray-100 dark:hover:bg-gray-700'>
                <span>{icon}</span>
                <span className='block ms-4'>{title}</span>
              </div>
            </ActiveRoute>
          )
        })}
        <div
          onClick={() => doLogout()}
          className='flex cursor-pointer text-primary py-3 px-2 border-t items-center rounded-sm text-base transition-all hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <span>
            <LogoutOutlined />
          </span>
          <span className='block ms-4'>{t('common:logout')}</span>
        </div>
      </div>
    </div>
  )
}

export default UserLayoutSidebar
