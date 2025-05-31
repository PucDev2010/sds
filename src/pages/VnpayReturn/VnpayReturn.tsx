import { useMutation } from '@tanstack/react-query'
import { Button, Result, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import orderApi from '~/api/order.api'
import backendErrorCode from '~/constant/backendErrorCode'
import path from '~/constant/path'
import useQueryParams from '~/hooks/useQueryParams'
import { normalizeKey } from '~/utils/utils'

function VnpayReturn() {
  const { t } = useTranslation()
  const { code, orderId, paymentStatus, orderStatus } = useQueryParams()
  const hanldePayNowMutation = useMutation({
    mutationFn: (orderId: number) => {
      return orderApi.fetchPaymentUrl(orderId)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        window.location.href = res.data.data.paymentUrl
      } else {
        if (res.data.errorCode === backendErrorCode.ORDER_PAID) {
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
      }
    }
  })
  const getStatus = (): { success: boolean; message: string; paymentStatus?: string } => {
    switch (code) {
      case '00':
        return {
          success: true,
          message: paymentStatus !== 'paid' ? t('message:vnPayNotPurchase') : t('message:vnpaySuccess')
        }
      case '02':
        return {
          success: true,
          message: t('message:vnPayOrderStatusError') + t(normalizeKey('orderManage:' + orderStatus))
        }
      case '04':
        return { success: false, message: t('message:vnPayInvalidAmount') }
      case '01':
        return { success: false, message: t('message:vnPayOrderNotFound') }
      case '97':
        return { success: false, message: t('message:vnPayInvalidOrderInformation') }
      default:
        return { success: false, message: t('message:vnPayError') }
    }
  }
  const status = getStatus()
  return (
    <Result
      className='min-h-screen bg-primary'
      status={status.success ? 'success' : 'error'}
      title={t('orderSuccess:title')}
      subTitle={status.message}
      extra={
        <div>
          <Link key={path.home} to={path.home}>
            <Button key='console'>{t('orderSuccess:goHome')}</Button>
          </Link>
          {(!status.success && orderId) ||
            (status.success && paymentStatus !== 'paid' && (
              <Button
                onClick={() => {
                  hanldePayNowMutation.mutate(parseInt(orderId))
                }}
                loading={hanldePayNowMutation.isLoading}
                disabled={hanldePayNowMutation.isLoading}
                danger
                type='primary'
                className='ms-2'
              >
                {t('purchase:rePurchase')}
              </Button>
            ))}
        </div>
      }
    />
  )
}

export default VnpayReturn
