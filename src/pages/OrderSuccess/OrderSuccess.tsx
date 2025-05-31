import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import path from '~/constant/path'
import { OrderSuccessResponse } from '~/types/order.type'

function OrderSuccess() {
  const { t } = useTranslation()
  const { state }: { state: OrderSuccessResponse } = useLocation()
  return (
    <Result
      className='min-h-screen bg-primary'
      status='success'
      title={t('orderSuccess:title')}
      subTitle={t('orderSuccess:description')}
      extra={[
        <Link key={path.home} to={path.home}>
          <Button type='primary' key='console'>
            {t('orderSuccess:continueShopping')}
          </Button>
        </Link>,
        <a href={state.paymentUrl}>
          <Button key={state.orderId} type='primary' danger>
            {t('orderSuccess:payNow')}
          </Button>
        </a>
      ]}
    />
  )
}

export default OrderSuccess
