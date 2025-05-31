import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { normalizeKey } from '~/utils/utils'
import FacebookIcon from '../CustomIcon/FacebookIcon'
import InstagramIcon from '../CustomIcon/InstagramIcon'
import TiktokIcon from '../CustomIcon/TiktokIcon'
import TwitterIcon from '../CustomIcon/TwitterIcon'
import Logo from '../Logo'
import MobileNav from './components/MobileNav'

function Footer() {
  const { t } = useTranslation()
  const abouts = [
    'mainLayout:footerCarreerLabel',
    'mainLayout:footerOurStoreLabel',
    'mainLayout:footerTermAndConditionLabel',
    'mainLayout:footerPolicyLabel'
  ]
  const customerCare = [
    'mainLayout:footerHelpLabel',
    'mainLayout:footerGuideLabel',
    'mainLayout:footerTrackOrderLabel',
    'mainLayout:footerPurchaseLabel',
    'mainLayout:footerRefundLabel'
  ]
  const FooterList = ({ items = [] }: { items: string[] }) => {
    return (
      <ul className='mt-2'>
        {items.map((item, index) => (
          <li
            className='cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded-md transition-all '
            style={{ fontSize: '1rem' }}
            key={index}
          >
            {t(normalizeKey(item))}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <>
      <div className='layout-padding bg-primary text-primary footer'>
        <div className='py-16 pb-20 md:pb-16 '>
          <Row
            gutter={[
              { xs: 8, md: 32 },
              { xs: 8, md: 32 }
            ]}
          >
            <Col xs={24} md={12} lg={6}>
              <Logo />
              <div style={{ fontSize: '1rem' }}>{t('mainLayout:footerSlowgant')}</div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <h3 className='text-xl px-2'>{t('common:aboutUs')}</h3>
              <FooterList items={abouts} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <h3 className='text-xl px-2'>{t('common:customCare')}</h3>
              <FooterList items={customerCare} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <h3 className='text-xl px-2'>{t('common:contact')}</h3>
              <ul className='mt-2'>
                <li
                  className='cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded-md transition-all '
                  style={{ fontSize: '1rem' }}
                >
                  {/* 2252/50 Quốc lộ 1, Tân Chánh Hiệp, Quận 12, Thành phố Hồ Chí Minh */}
                </li>
                <li
                  className='cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded-md transition-all '
                  style={{ fontSize: '1rem' }}
                >
                  {/* Email: liushizi1999@gmail.com */}
                </li>
                <li
                  className='cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded-md transition-all '
                  style={{ fontSize: '1rem' }}
                >
                  {/* Hotline: 0399.xxx.xxx */}
                </li>
                <li className='flex'>
                  <div className='p-1 ms-2 border rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all'>
                    <FacebookIcon className='text-gray-600 mx-2 dark:text-gray-100' />
                  </div>
                  <div className='p-1 ms-2 border rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all'>
                    <InstagramIcon className='text-gray-600 mx-2 dark:text-gray-100' />
                  </div>
                  <div className='p-1 ms-2 border rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all'>
                    <TiktokIcon className='text-gray-600 mx-2 dark:text-gray-100' />
                  </div>
                  <div className='p-1 ms-2 border rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all'>
                    <TwitterIcon className='text-gray-600 mx-2 dark:text-gray-100' />
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>
      <MobileNav />
    </>
  )
}

export default Footer
