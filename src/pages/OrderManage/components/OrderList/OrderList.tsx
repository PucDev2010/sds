import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import orderApi from '~/api/order.api'
import LoadingOverlay from '~/components/Loading/LoadingOverlay'
import QueryKey from '~/constant/queryKey'
import useQueryConfig, { OrderStatus } from '~/hooks/useQueryConfig'
import { Order, OrderStatusType } from '~/types/order.type'
import { Page } from '~/types/page.type'
import OrderItem from '../OrderItem'
import { Button, Checkbox, Empty, Form, Modal, Pagination, message } from 'antd'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { handleError, showMessageRespone } from '~/utils/utils'
import { CartProduct } from '~/types/product.type'
import cartApi from '~/api/cart.api'
import path from '~/constant/path'
import TextArea from 'antd/es/input/TextArea'
import Rating from '../OrderItem/Rating'
import { RateOrder } from '~/types/rate.type'
import { rateApi } from '~/api/rate.api'
import LoadingModal from '~/components/Loading/LoadingModal'
import { VnpayQueryDR } from '~/types/utils.type'
import QueryTransaction from '../QueryTransaction/QueryTransaction'

function OrderList() {
  const queryConfig = useQueryConfig(6)
  const { t } = useTranslation()
  const [pageOrder, setPageOrder] = useState<Page<Order>>()
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [openRateModal, setOpenRateModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const [ratePoint, setRatePoint] = useState(5)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [processingOrder, setProcessingOrder] = useState<Order>()
  const [queryTransactioResult, setQueryTransactionResult] = useState<VnpayQueryDR>()
  const [openQueryTransactionModal, setOpenQueryTransactionModal] = useState(false)

  const fetchOrder = useQuery({
    queryKey: [QueryKey.fetchOrder, queryConfig],
    queryFn: () => {
      return orderApi.fetchOrder(queryConfig)
    },
    staleTime: 10 * 60 * 1000
  })

  const handleCancelMutation = useMutation({
    mutationFn: (id: number) => {
      return orderApi.cancelOrder(id)
    },
    onSuccess: (res, orderId) => {
      showMessageRespone(res.data)
      if (res.data.success) {
        if (pageOrder) {
          let orders = pageOrder.datas
          const order = orders.find((item) => item.id === orderId)
          if (order) {
            order.orderStatus = OrderStatus.cancelled as OrderStatusType
            queryClient.invalidateQueries({ queryKey: [QueryKey.fetchOrder] })
            setPageOrder({ ...pageOrder, datas: orders })
            // Clear cache of rating product
            order.orderItems.forEach((item) => {
              queryClient.invalidateQueries({ queryKey: [QueryKey.fetchProduct, item.product.id] })
            })
          }
          setOpenCancelModal(false)
        }
      }
    },
    onError: (err) => {
      handleError(err)
    }
  })

  const handleBuyAgainMutation = useMutation({
    mutationFn: (order: Order) => {
      let body: CartProduct[] = order.orderItems.map((orderItem) => {
        return {
          product: orderItem.product,
          productAttribute: orderItem.productAttribute,
          quantity: 1
        }
      })
      return cartApi.buyAgain(body)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        const cartItemIds = res.data.data.map((item) => item.id)
        navigate(`${path.cart}?ids=${cartItemIds.join(',')}`)
      } else {
        showMessageRespone(res.data)
      }
    }
  })

  const handleRateMutation = useMutation({
    mutationFn: (body: RateOrder) => {
      return rateApi.rateOrder(body)
    },
    onSuccess: (res, body) => {
      showMessageRespone(res.data)
      setOpenRateModal(false)
      if (res.data.success) {
        if (pageOrder) {
          let orders = pageOrder.datas
          const order = orders.find((item) => item.id === body.order.id)
          if (order) {
            order.rated = true
            setPageOrder({ ...pageOrder, datas: orders })
            // Clear cache of rating product
            order.orderItems.forEach((item) => {
              queryClient.invalidateQueries({ queryKey: [QueryKey.fetchRate, item.product.id] })
            })
          }
        }
      }
    },
    onError: (err) => {
      handleError(err)
    }
  })

  useEffect(() => {
    if (fetchOrder.data) {
      setPageOrder(fetchOrder.data.data.data)
    }
  }, [fetchOrder.data])

  const findProcessingOrder = (orderId: number) => {
    return pageOrder?.datas.find((item) => item.id === orderId)
  }
  const handleCancelOrder = (orderId: number) => {
    setProcessingOrder(findProcessingOrder(orderId))
    setOpenCancelModal(true)
  }

  const handleContact = (orderId: number) => {
    message.info(t('orderManage:developingFeature'))
  }
  const handleRate = (orderId: number) => {
    setProcessingOrder(findProcessingOrder(orderId))
    setOpenRateModal(true)
  }
  const handleBuyAgain = (orderId: number) => {
    const order = findProcessingOrder(orderId)
    if (order) {
      handleBuyAgainMutation.mutate(order)
    }
  }
  const handleSubmitRate = (values: any) => {
    const body: RateOrder = {
      order: processingOrder as Order,
      products: processingOrder?.orderItems.map((item) => item.product) || [],
      content: values?.content || 'No content',
      ratePoint
    }
    handleRateMutation.mutate(body)
  }

  const handleChangePage = (page: number) => {
    navigate({
      pathname: path.orderManagement,
      search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
    })
  }
  const queryTransactionMutation = useMutation({
    mutationFn: (orderId: number) => {
      return orderApi.queryTransaction(orderId)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        setQueryTransactionResult(res.data.data)
        setOpenQueryTransactionModal(true)
      } else {
        message.error('Cannot query transaction')
      }
    }
  })
  if (fetchOrder.isLoading) {
    return <LoadingOverlay loading />
  }
  return (
    <>
      <div className='mt-2'>
        {pageOrder?.datas && pageOrder.datas.length > 0 ? (
          <div>
            {pageOrder.datas.map((order) => {
              return (
                <OrderItem
                  onCancel={handleCancelOrder}
                  onContact={handleContact}
                  onRate={handleRate}
                  onBuyAgain={handleBuyAgain}
                  onQueryTransaction={queryTransactionMutation.mutate}
                  key={order.id}
                  order={order}
                />
              )
            })}
            <div className='bg-primary py-4 my-4 md:my-6 flex justify-end'>
              <Pagination
                defaultCurrent={1}
                current={pageOrder.currentPage + 1}
                pageSize={pageOrder.pageSize}
                showSizeChanger={false}
                total={pageOrder.totalItems}
                onChange={handleChangePage}
              />
            </div>
          </div>
        ) : (
          <div className='bg-primary py-24'>
            <Empty />
          </div>
        )}
      </div>
      {/* Modal */}
      <Modal
        title={t('common:confirm')}
        open={openCancelModal}
        onCancel={() => setOpenCancelModal(false)}
        footer={
          <div>
            <Button
              onClick={() => {
                if (processingOrder?.id) {
                  handleCancelMutation.mutate(processingOrder.id)
                }
              }}
              disabled={handleCancelMutation.isLoading}
              loading={handleCancelMutation.isLoading}
              className='me-2'
              type='primary'
              danger
            >
              {t('common:confirm')}
            </Button>
            <Button onClick={() => setOpenCancelModal(false)} className='me-2' type='default'>
              {t('common:cancel')}
            </Button>
          </div>
        }
      >
        <div className='py-2'>{t('orderManage:confirmCancelOrder')}</div>
      </Modal>
      {/* Rating modal */}
      <Modal
        onCancel={() => setOpenRateModal(false)}
        title={t('orderManage:rateYourOrder')}
        open={openRateModal}
        footer={null}
      >
        <Form onFinish={handleSubmitRate} form={form} layout='vertical'>
          <div className='py-2 flex justify-center my-2'>
            <Rating ratePoint={ratePoint} onClick={(point: number) => setRatePoint(point)} />
          </div>
          <Form.Item
            name={'content'}
            required
            rules={[{ required: true, message: t('message:notEmptyField') }]}
            label={t('orderManage:content')}
          >
            <TextArea minLength={50} rows={6} placeholder={t('orderManage:maxLength')} maxLength={255} />
          </Form.Item>
          <Form.Item required>
            <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
              <div className='flex-1'>{t('orderManage:onlyRateOnce')}</div>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <div>
              <Button
                disabled={!checked || handleRateMutation.isLoading}
                loading={handleRateMutation.isLoading}
                className='me-2'
                type='primary'
                danger
                htmlType='submit'
              >
                {t('common:confirm')}
              </Button>
              <Button onClick={() => setOpenRateModal(false)} className='me-2' type='default'>
                {t('common:cancel')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {!!queryTransactioResult && openQueryTransactionModal && (
        <Modal style={{ top: 10 }} width={1200} open footer={null} onCancel={() => setOpenQueryTransactionModal(false)}>
          <QueryTransaction data={queryTransactioResult} />
        </Modal>
      )}
      <LoadingModal
        loading={
          handleBuyAgainMutation.isLoading || handleCancelMutation.isLoading || queryTransactionMutation.isLoading
        }
      />
    </>
  )
}

export default OrderList
