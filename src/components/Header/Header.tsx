import { useState } from 'react'
import { createSearchParams, To, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MenuOutlined } from '@ant-design/icons'
import Search from 'antd/es/input/Search'
import { Drawer } from 'antd'

import HeaderIcon from './components/HeaderIcon'
import Logo from '~/components/Logo'
import SwitchLocale from '~/components/SwitchLocale'
import SwitchTheme from '~/components/SwitchTheme/SwitchTheme'
import FacebookIcon from '~/components/CustomIcon/FacebookIcon'
import InstagramIcon from '~/components/CustomIcon/InstagramIcon'
import TiktokIcon from '~/components/CustomIcon/TiktokIcon'
import TwitterIcon from '~/components/CustomIcon/TwitterIcon'
import path from '~/constant/path'
import useQueryConfig from '~/hooks/useQueryConfig'
import Cart from './components/Cart'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import ActiveRoute from '../ActiveRoute'
import HeaderUserIcon from './components/HeaderUserIcon'

type NavItemsLink = {
  name: string
  to: To
}

function Header() {
  const { t } = useTranslation()
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const queryConfig = useQueryConfig(16)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navItems: NavItemsLink[] = [
    {
      name: t('mainLayout:navHome'),
      to: path.home
    },
    {
      name: t('mainLayout:navProduct'),
      to: path.products
    },
    {
      name: t('mainLayout:navCoupon'),
      to: path.coupon
    },
    {
      name: t('mainLayout:navGuide'),
      to: path.guide
    }
  ]

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate({
        pathname: path.products,
        search: createSearchParams({ ...queryConfig, keyWord: value }).toString()
      })
    }
  }
  return (
    <>
      <header className='h-header-height flex flex-col w-full bg-primary layout-padding shadow-md sticky top-0 z-50'>
        <nav className=' border-gray-100 flex justify-between items-center'>
          <Logo height={60} />
          <div className='hidden md:flex items-center'>
            <SwitchLocale className='me-4' />
            <SwitchTheme />
            <div className='bg-gray-300 h-6 ms-6 me-5' style={{ width: '2px' }}></div>
            <FacebookIcon className='text-gray-600 mx-2 dark:text-gray-100' />
            <InstagramIcon className='text-gray-600 mx-2 dark:text-gray-100' />
            <TiktokIcon className='text-gray-600 mx-2 dark:text-gray-100' />
            <TwitterIcon className='text-gray-600 mx-2 dark:text-gray-100' />
          </div>
          <div onClick={() => setOpen(true)} className='block md:hidden cursor-pointer'>
            <HeaderIcon icon={<MenuOutlined />} />
          </div>
        </nav>
        {/* PC */}
        <nav className='hidden md:flex flex-1 mt-1 items-center justify-between'>
          <div onClick={() => setOpen(true)} className='block lg:hidden cursor-pointer'>
            <HeaderIcon icon={<MenuOutlined />} />
          </div>
          <div className='hidden lg:flex nav-link'>
            {navItems.map((item, index) => {
              return (
                <ActiveRoute className='me-3 xl:me-4 ' key={index} to={item.to}>
                  {item.name}
                </ActiveRoute>
              )
            })}
          </div>
          <div className='flex items-center justify-between py-1'>
            <Search
              onSearch={handleSearch}
              allowClear
              placeholder={t('mainLayout:searchPlaceHolder')}
              className='me-1'
            />
            <HeaderUserIcon />
            {/* Cart */}
            <Cart />
          </div>
        </nav>
        <div className='flex md:hidden pb-1  items-center justify-between'>
          <Search
            size='large'
            onSearch={handleSearch}
            allowClear
            placeholder={t('mainLayout:searchPlaceHolder')}
            className='me-1'
          />
        </div>
        {/* Mobile */}
        <div className='pb-1'></div>
      </header>
      {open && (
        <Drawer zIndex={1000} className='relative' open={open} onClose={() => setOpen(false)} placement='left'>
          <div>
            {navItems.map((item, index) => {
              return (
                <ActiveRoute
                  className='me-3 xl:me-4 py-2 hover:text-pink-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-pink-600'
                  onClick={() => setOpen(false)}
                  key={index}
                  to={item.to}
                >
                  <div className='ps-2'>{item.name}</div>
                </ActiveRoute>
              )
            })}
          </div>
          <ActiveRoute
            className='me-3 xl:me-4 py-2 hover:text-pink-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-pink-600'
            to={isAuthenticated ? path.me : path.login}
          >
            <div className='ps-2'>{t('common:account')}</div>
          </ActiveRoute>
          <div className='md:hidden flex items-center py-2 px-2 mt-1'>
            <SwitchLocale className='me-4' />
            <SwitchTheme />
          </div>
          <div className='absolute bottom-2 text-center right-1/2 translate-x-1/2 dark:text-gray-100'>
            @Allright reserved
          </div>
        </Drawer>
      )}
    </>
  )
}

export default Header
