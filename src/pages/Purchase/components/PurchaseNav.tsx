import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

function PurchaseNav() {
  const { t } = useTranslation()
  return (
    <nav className='px-1 md:px-8 py-2 bg-primary'>
      <Row>
        <Col lg={2} md={24}>
          <span className='text-base text-primary'>{t('cart:product')}</span>
        </Col>
        <Col lg={22}>
          <Row gutter={[8, 8]}>
            <Col lg={6} md={24}></Col>
            <Col lg={18} md={24}>
              <div className='hidden lg:flex text-base text-primary'>
                <div className='flex-1 text-center'>{t('cart:properties')}</div>
                <div className='flex-1 text-center'>{t('cart:price')}</div>
                <div className='flex-1 text-center'>{t('cart:quantity')}</div>
                <div className='flex-1 text-center'>{t('cart:money')}</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </nav>
  )
}

export default PurchaseNav
