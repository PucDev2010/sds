import { Link, createSearchParams } from 'react-router-dom'
import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'

import HeaderIcon from './HeaderIcon'
import { RootState } from '~/store/store'
import path from '~/constant/path'
import MeAvatar from '~/components/MeAvatar/MeAvatar'
import useQueryConfig, { OrderStatus } from '~/hooks/useQueryConfig'
import useLogout from '~/hooks/useLogout'
import LoginLink from '~/components/LoginLink'

function HeaderUserIcon() {
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const { t } = useTranslation()
  const queryConfig = useQueryConfig(6)
  const { doLogout } = useLogout()
  const items = [
    {
      title: t('meLayout:navMe'),
      to: path.me
    },
    {
      title: t('meLayout:navOrderManagement'),
      to: {
        pathname: path.orderManagement,
        search: createSearchParams({ ...queryConfig, orderStatus: OrderStatus.processing }).toString()
      }
    },
    {
      title: t('meLayout:navChangePassword'),
      to: path.changePassword
    }
  ]
  const content = (
    <div>
      {items.map(({ title, to }, index) => {
        return (
          <Link key={index} to={to}>
            <div className='text-primary rounded-md flex py-1.5 px-2 items-center justify-between text-base transition-all hover:bg-gray-100 dark:hover:bg-gray-700'>
              <span className='block'>{title}</span>
            </div>
          </Link>
        )
      })}
      <div
        onClick={() => doLogout()}
        className='text-primary rounded-md flex py-1.5 px-2 cursor-pointer text-primary items-center text-base transition-all hover:bg-gray-100 dark:hover:bg-gray-700'
      >
        <span className='block '>{t('common:logout')}</span>
      </div>
    </div>
  )

  return isAuthenticated ? (
    <Popover content={content} placement='bottomRight'>
      <Link to={path.me}>
        <div className='w-10 h-10 mx-1 rounded-full flex items-center justify-center transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 '>
          <MeAvatar size={34} />
        </div>
      </Link>
    </Popover>
  ) : (
    <LoginLink>
      <HeaderIcon icon={<UserOutlined style={{ fontSize: '1.3rem' }} />} />
    </LoginLink>
  )
}

export default HeaderUserIcon
