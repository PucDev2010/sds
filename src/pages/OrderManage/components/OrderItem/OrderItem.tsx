import { useState } from 'react'
import { EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Button, Col, Image, Row, message } from 'antd'
import { Link } from 'react-router-dom'

import Status from '../Status'
import { Order } from '~/types/order.type'
import { formatCurrency, generateNameId, normalizeKey } from '~/utils/utils'
import path from '~/constant/path'
import { OrderStatus } from '~/hooks/useQueryConfig'
import classNames from 'classnames'
import { useMutation } from '@tanstack/react-query'
import orderApi from '~/api/order.api'
import backendErrorCode from '~/constant/backendErrorCode'
import TruckIcon from '~/components/CustomIcon/TruckIcon'

type OrderItemProps = {
  order: Order
  onContact: (id: number) => void
  onCancel: (id: number) => void
  onRate: (id: number) => void
  onBuyAgain: (id: number) => void
  onQueryTransaction: (id: number) => void
}

function OrderItem({ order, onQueryTransaction, onContact, onCancel, onBuyAgain, onRate }: OrderItemProps) {
  const { t } = useTranslation()
  const [showDetail, setShowDetail] = useState(false)
  const {
    id,
    address,
    orderItems,
    orderStatus,
    totalPayment,
    paymentStatus,
    phone,
    discount,
    payDate,
    shipFee,
    note,
    shipCode,
    transportName
  } = order

  const hanldePayNowMutation = useMutation({
    mutationFn: () => {
      return orderApi.fetchPaymentUrl(id)
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

  return (
    <div className='bg-primary my-2 px-2 w-full h-full md:px-6 relative py-2 md:py-3 rounded-sm shadow-sm'>
      <div className='flex justify-end border-b py-2'>
        <div className='flex items-center'>
          <Status orderStatus={orderStatus} />
          <div className='h-6 mx-2 border-l-2'></div>
          <div onClick={() => setShowDetail((prev) => !prev)} className='text-red-600 cursor-pointer'>
            {!showDetail ? t('orderManage:detail') : t('orderManage:hide')}
          </div>
        </div>
      </div>
      {showDetail && (
        <>
          <div className='flex items-start py-2 md:py-4 border-b'>
            <div style={{ paddingTop: 2 }}>
              <EnvironmentOutlined />
            </div>
            <div className='ps-2'>
              <div className='text-primary font-semibold text-sm md:text-base'>{t('orderManage:deliveryAddress')}</div>
              <div className='mt-1'>{phone}</div>
              <div className='mt-1'>{address}</div>
            </div>
          </div>
          <div className='flex items-start py-2 md:py-4 border-b'>
            <div style={{ paddingTop: 2 }}>
              <TruckIcon />
            </div>
            <div className='ps-2'>
              <div className='text-primary font-semibold text-sm md:text-base'>{t('orderManage:delivery')}</div>
              <div className='mt-1'>{transportName}</div>
              {shipCode && (
                <div>
                  <div>
                    {t('orderManage:shipCode')}:<span className='ms-2'>{shipCode}</span>
                  </div>
                  <a
                    href={`https://tracking.ghn.dev/?order_code=${shipCode}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {t('orderManage:trackingOrder')}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className='flex items-start py-2 md:py-4 border-b'>
            <div style={{ paddingTop: 2 }}>
              <CreditCardOutlined />
            </div>
            <div className='ps-2'>
              <div className='text-primary font-semibold text-sm md:text-base'>{t('orderManage:payment')}</div>
              <div className='mt-1'>
                {t('common:paymentMethod')}: <span>{payDate ? t('purchase:paymentWithCard') : t('purchase:cod')}</span>
              </div>
              <div className='mt-1'>
                {t('cart:discount')}: <span className='text-red-500'>{formatCurrency(discount)}</span>
              </div>
              <div className='mt-1'>
                {t('purchase:shipFee')}: <span className='text-red-500'>{formatCurrency(shipFee)}</span>
              </div>
              {paymentStatus === 'paid' && (
                <div className='mt-1'>
                  <Button onClick={() => onQueryTransaction(order.id)} size='small' danger>
                    {t('orderManage:detail')}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {note && <div className='flex items-start py-2 md:py-4 border-b'>{t('common:note') + note}</div>}
        </>
      )}
      {orderItems.map((orderItem) => {
        const { id, product, quantity, productAttribute, discount, price } = orderItem
        return (
          <div key={id} className='py-2 md:py-4 border-b'>
            <Row align={'middle'}>
              <Col xs={24} sm={24} md={18}>
                <div className='flex'>
                  <Image width={96} height={96} src={product.thumbnail} />
                  <Link
                    className='flex-1 flex flex-col ps-2 justify-between'
                    to={`${path.product}/${generateNameId({ name: product.name, id: product.id + '' })}`}
                  >
                    <div className='line-clamp-1 text-sm md:text-base text-primary'>{product.name}</div>
                    <div className='flex text-primary'>
                      <span>
                        {t('cart:size')}: {productAttribute.size.name}
                      </span>
                      <div className='mx-4 border-l-2'></div>
                      <span>
                        {t('cart:color')}: {productAttribute.color.name}
                      </span>
                    </div>
                    <div className='text-primary'>x{quantity}</div>
                  </Link>
                </div>
              </Col>
              <Col xs={24} sm={24} md={6}>
                <div className='flex justify-end text-base'>
                  {discount > 0 && (
                    <div className='me-2 text-primary text-gray-600 line-through'>
                      {formatCurrency(price / (1 - discount))}đ
                    </div>
                  )}
                  <div className='text-red-600'>{formatCurrency(price)}đ</div>
                </div>
              </Col>
            </Row>
          </div>
        )
      })}
      <div className='flex items-center py-3 justify-end '>
        <div className='text-primary me-2 text-sm md:text-base'>{t('cart:totalPayment')}:</div>
        <div className='text-xl md:text-3xl text-red-600'>
          {formatCurrency(totalPayment)}
          <span>đ</span>
        </div>
      </div>
      <div className='flex justify-between py-2'>
        <div className='flex flex-col '>
          <div>
            {t('orderManage:paymentStatus')}:
            <span className={classNames('ms-2 text-red-500', { 'text-green-500': paymentStatus === 'paid' })}>
              {t(normalizeKey(`orderManage:${paymentStatus}`))}
            </span>
          </div>
          {paymentStatus !== 'paid' && orderStatus === 'processing' && (
            <div className='mt-2'>
              <Button
                onClick={() => {
                  hanldePayNowMutation.mutate()
                }}
                loading={hanldePayNowMutation.isLoading}
                disabled={hanldePayNowMutation.isLoading}
                danger
                type='primary'
              >
                {t('orderManage:purchase')}
              </Button>
            </div>
          )}
        </div>
        <div className='flex items-end'>
          {(orderStatus === OrderStatus.cancelled || orderStatus === OrderStatus.delivered) && (
            <Button onClick={() => onBuyAgain(order.id)} className='me-2' type='primary' danger>
              {t('orderManage:buyAgain')}
            </Button>
          )}
          {orderStatus === OrderStatus.processing && (
            <Button onClick={() => onCancel(order.id)} className='me-2' type='primary' danger>
              {t('common:cancel')}
            </Button>
          )}
          {(orderStatus === OrderStatus.delivering || orderStatus === OrderStatus.processing) && (
            <Button onClick={() => onContact(order.id)} className='me-2' type='default'>
              {t('common:contact')}
            </Button>
          )}
          {orderStatus === OrderStatus.delivered && (
            <Button onClick={() => onRate(order.id)} disabled={order.rated} className='me-2'>
              {!order.rated ? t('common:rate') : t('orderManage:rated')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderItem
