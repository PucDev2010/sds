import { UserOutlined, HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { createSearchParams } from 'react-router-dom'

import path from '~/constant/path'
import OrderIcon from '~/components/CustomIcon/OrderIcon'
import useQueryConfig, { OrderStatus } from '~/hooks/useQueryConfig'
import ActiveRoute from '~/components/ActiveRoute'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { useMemo } from 'react'
import { Badge } from 'antd'
import CategoryIcon from '~/components/CustomIcon/CategoryIcon'

function MobileNav() {
  const { t } = useTranslation()
  const queryConfig = useQueryConfig(6)
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const { cart } = useSelector((root: RootState) => root.cart)
  const total = useMemo(() => {
    return cart.reduce((prev, current) => prev + current.quantity, 0)
  }, [cart])
  const items = [
    {
      title: t('mainLayout:navHome'),
      icon: <HomeOutlined />,
      to: path.home
    },
    {
      title: t('mainLayout:navProduct'),
      icon: <CategoryIcon />,
      to: path.products
    },
    {
      title: t('mainLayout:navCart'),
      icon: (
        <Badge count={total} offset={[2, 6]}>
          <div className='text-xl'>
            <ShoppingCartOutlined />
          </div>
        </Badge>
      ),
      to: isAuthenticated ? path.cart : path.login
    },
    {
      title: t('mainLayout:navMe'),
      icon: <UserOutlined />,
      to: isAuthenticated ? path.meMobile : path.login
    }
  ]
  return (
    <div className='fixed py-1 bg-primary text-primary shadow-md border-t border-gray-300 md:hidden z-50 bottom-0 left-0 right-0 flex'>
      {items.map((item) => {
        return (
          <div className='flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ' key={item.title}>
            <ActiveRoute className='flex hover:text-pink-500 py-1 flex-col items-center ' to={item.to}>
              <div className='text-lg'>{item.icon}</div>
              <div className='text-sm'>{item.title}</div>
            </ActiveRoute>
          </div>
        )
      })}
    </div>
  )
}

export default MobileNav
