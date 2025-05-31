import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { Alert, Button, Col, Input, Modal, Row, message } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { find, findIndex, pick } from 'lodash'

import './purchase.css'
import OrderAddress from './components/OrderAddress'
import { UserAddress } from '~/types/user.type'
import QueryKey from '~/constant/queryKey'
import userApi from '~/api/user.api'
import { AxiosError } from 'axios'
import OrderItem from './components/OrderItem'
import { formatCurrency, handleError, normalizeKey } from '~/utils/utils'
import { getProductAttributePrice } from '~/utils/product.utils'
import PurchaseNav from './components/PurchaseNav'
import { Voucher } from '~/types/voucher.type'
import OrderVoucher from './components/OrderVoucher'
import { OrderDTO, ShipServiceType } from '~/types/order.type'
import orderApi from '~/api/order.api'
import LoadingModal from '~/components/Loading/LoadingModal'
import { useDispatch } from 'react-redux'
import { removeItemAfterOrder } from '~/slices/cartSlice'
import { setPreOrder, initialPreOrder } from '~/slices/orderSlice'
import { useNavigate } from 'react-router-dom'
import path from '~/constant/path'
import config from '~/constant/config'
import shipApi from '~/api/ship.api'
import { PaymentMethod } from '~/types/PaymentMethod.type'
import { canApplyVoucher, getVoucherDiscount } from '~/utils/voucher.utils'

const { paymentMethods } = config

function Purchase() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { preOrderItems, voucher } = useSelector((root: RootState) => root.order)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | undefined>()
  const [selectedPaymentMethod, setSlectedPaymentMethod] = useState(paymentMethods[0])
  const [selectedShipService, setSelectedShipService] = useState<ShipServiceType | undefined>()
  const [shipServices, setShipServices] = useState<ShipServiceType[]>([])
  const [orderVoucher, setOrderVoucher] = useState<Voucher | undefined>(voucher || undefined)
  const [note, setNote] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [openShipServiceModal, setOpenShipServiceModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [faileToGetShipService, setFaileToGetShipService] = useState(false)
  // Hanlde UserAddress
  const fetchAllAddress = useQuery({
    queryKey: [QueryKey.fetchAddress],
    queryFn: () => {
      return userApi.fetchAllAddress()
    },
    staleTime: 10 * 60 * 1000,
    onError: (err: AxiosError) => {
      console.error('Fetch user address error:' + err.message)
    }
  })

  useEffect(() => {
    if (fetchAllAddress.data) {
      setAddresses(fetchAllAddress.data.data.data)
    }
  }, [fetchAllAddress.data])

  useQuery({
    queryKey: [QueryKey.fetchShipInformation],
    queryFn: () => {
      return shipApi.getShipInformation(preOrderItems, selectedAddress as UserAddress)
    },
    enabled: !!selectedAddress,
    retry: 0,
    onSuccess: (res) => {
      if (res.length > 0) {
        setShipServices(res)
        setSelectedShipService(res[0])
      } else {
        setFaileToGetShipService(true)
      }
    },
    onError: (err) => {
      setFaileToGetShipService(true)
    }
  })
  const purchase = useMutation({
    mutationFn: (body: OrderDTO) => {
      return orderApi.createOrder(body)
    },
    onSuccess: (res) => {
      const { message, success, errorCode, data } = res.data
      if (success) {
        let ids = preOrderItems.map((item) => item.id)
        queryClient.invalidateQueries([QueryKey.fetchUserVoucher], { refetchType: 'none' })
        dispatch(removeItemAfterOrder(ids))
        dispatch(setPreOrder(initialPreOrder))
        if (data.paymentUrl && selectedPaymentMethod.id === 2) {
          window.location.replace(data.paymentUrl)
        } else {
          navigate(path.orderSuccess, { state: data })
        }
      } else {
        // Error by voucher. Errorcode is 3xxx
        if (errorCode && errorCode >= 3000 && errorCode < 4000) {
          setOrderVoucher(undefined)
          setErrorMessage(message + '. ' + t('message:orderVoucherError'))
        } else {
          setErrorMessage(message + '. ' + t('message:orderQuantityOutOfStock'))
        }
        setOpenModal(true)
      }
    },
    onError: (error) => {
      handleError(error)
    }
  })

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(() => {
        return find(addresses, { defaultAddress: true }) || addresses[0]
      })
    }
  }, [addresses])

  const handleSubmitAddressForm = (userAddress: UserAddress) => {
    const index = findIndex(addresses, { id: userAddress.id })
    if (index > -1) {
      if (userAddress.id === selectedAddress?.id) {
        setSelectedAddress(userAddress)
      }
      setAddresses((prev) => {
        prev[index] = userAddress
        return prev
      })
    } else {
      setAddresses((prev) => [...prev, userAddress])
    }
  }
  const handleChangeAddress = (userAddress: UserAddress) => {
    setSelectedAddress(userAddress)
  }
  const total = useMemo(() => {
    return preOrderItems.reduce((acc, cur) => {
      return acc + getProductAttributePrice(cur.productAttribute) * cur.quantity
    }, 0)
  }, [])

  const handleSlectedPaymentMethod = (method: PaymentMethod) => {
    setSlectedPaymentMethod(method)
    if (orderVoucher) {
      setOrderVoucher((prev) => ({
        ...(prev as Voucher),
        avaiable: canApplyVoucher(
          prev as Voucher,
          total,
          preOrderItems.map((item) => item.product.id),
          method
        )
      }))
    }
  }

  const handlePurchase = () => {
    if (!selectedAddress) {
      message.error(t('message:userAddressEmpty'))
    } else {
      let data: OrderDTO = {
        orderItemDTOS: preOrderItems,
        userAddress: selectedAddress,
        paymentMethod: pick(selectedPaymentMethod, 'id') as PaymentMethod,
        transportName: selectedShipService?.short_name,
        note,
        shipFee: selectedShipService?.total || config.shopInfomation.defaultShipFee,
        wardCode: selectedAddress.wardCode as string,
        districtId: parseInt(selectedAddress?.districtCode || '0'),
        serviceTypeId: selectedShipService?.service_type_id as number
      }
      if (orderVoucher?.code) {
        data.voucher = orderVoucher
      }
      purchase.mutate(data)
    }
  }

  const getDiscount = () => {
    if (orderVoucher && orderVoucher.avaiable && selectedShipService) {
      return getVoucherDiscount(
        orderVoucher,
        total,
        preOrderItems.map((item) => item.product.id),
        selectedShipService?.total || 0,
        selectedPaymentMethod
      )
    }
    return 0
  }

  return (
    <div className='px-2 md:px-4 lg:px-6 xl:px-10'>
      <OrderAddress
        onSubmitAddressForm={handleSubmitAddressForm}
        selectedAddress={selectedAddress}
        addresses={addresses}
        onChangeAddress={handleChangeAddress}
      />
      <PurchaseNav />
      <div className='my-2'>
        {preOrderItems.map((item) => (
          <OrderItem key={item.id} orderProduct={item} />
        ))}
      </div>
      <div className='px-1 md:px-8 py-4 my-2 bg-primary'>
        <Row>
          <Col xs={24} md={12} lg={12}>
            <div className='w-full md:w-80 lg:w-96 flex items-center'>
              <label className='me-2'>{t('common:note')}</label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} className='flex-1' size='middle' />
            </div>
          </Col>
          <Col xs={24} md={12} lg={12}>
            {/* Ship fee */}
            {faileToGetShipService ? (
              <div className='text-red-500'>{t('purchase:noShipService')}</div>
            ) : (
              <div>
                <div className='flex flex-wrap justify-between mt-4 md:mt-0'>
                  <div className='flex text-primary'>
                    <div>
                      <div className='pb-1'>{selectedShipService?.short_name}</div>
                      <div className='text-xs text-gray-500'>{`${t('purchase:estimateTime')}: ${
                        selectedShipService?.leadtime || ''
                      }`}</div>
                    </div>
                    <Button onClick={() => setOpenShipServiceModal(true)} className='ms-2' type='link' size='small'>
                      {t('purchase:change')}
                    </Button>
                  </div>
                  <div className='text-red-500'>{formatCurrency(selectedShipService?.total || 0)}</div>
                </div>
                {!selectedAddress && <div className='mt-2 text-xs text-gray-500'>{t('purchase:notAddress')}</div>}
              </div>
            )}
          </Col>
        </Row>
      </div>
      <OrderVoucher
        orderItemDTOS={preOrderItems}
        voucher={orderVoucher}
        onChangeVoucher={(newVoucher) => {
          setOrderVoucher(newVoucher)
        }}
        paymentMethod={selectedPaymentMethod}
      />
      <div className='px-1 md:px-8 py-4 my-2 bg-primary'>
        <div className='text-lg mb-2 text-primary'>{t('common:paymentMethod')}</div>
        <div className='flex flex-wrap'>
          {paymentMethods.map((item) => {
            return (
              <Button
                icon={selectedPaymentMethod.id === item.id ? <CheckOutlined /> : null}
                type={selectedPaymentMethod.id === item.id ? 'primary' : 'default'}
                className='me-2 my-1'
                danger={selectedPaymentMethod.id === item.id}
                key={item.id}
                onClick={() => handleSlectedPaymentMethod(item)}
              >
                {item.name && t(normalizeKey(item.name))}
              </Button>
            )
          })}
        </div>
      </div>
      <div className='px-1 md:px-8 py-4 flex justify-start md:justify-end bg-primary my-2'>
        <div className='w-full md:w-1/2 lg:w-1/4 '>
          <div className='flex justify-between py-1 text-gray-500 '>
            <label className=''>{t('purchase:total')}:</label>
            <div className='font-semibold'>
              {formatCurrency(total)}
              <span className='inline-block ms-1'>đ</span>
            </div>
          </div>
          <div className='flex justify-between py-1 text-gray-500'>
            <label className=''>{t('purchase:shipFee')}:</label>
            <div className='font-semibold'>
              {formatCurrency(selectedShipService?.total || config.shopInfomation.defaultShipFee)}
              <span className='inline-block ms-1'>đ</span>
            </div>
          </div>
          <div className='flex justify-between py-1 text-gray-500'>
            <label className=''>{t('purchase:discount')}:</label>
            <div className='font-semibold'>
              {formatCurrency(getDiscount())}
              <span className='inline-block ms-1'>đ</span>
            </div>
          </div>
          <div className='flex justify-between py-1 text-gray-500 items-end'>
            <label className=''>{t('purchase:totalPayment')}:</label>
            <div className='font-semibold text-red-500 text-3xl'>
              {formatCurrency(
                total + (selectedShipService?.total || config.shopInfomation.defaultShipFee) - getDiscount()
              )}
              <span className='inline-block ms-1'>đ</span>
            </div>
          </div>
          <div className='flex justify-end pt-2'>
            <Button disabled={faileToGetShipService} onClick={handlePurchase} danger type='primary' className='flex-1'>
              {t('purchase:purchase')}
            </Button>
          </div>
        </div>
      </div>
      <LoadingModal loading={purchase.isLoading} />
      {/*  */}
      <Modal
        onCancel={() => setOpenModal(false)}
        title={t('common:notification')}
        open={openModal}
        footer={
          <Button onClick={() => setOpenModal(false)} type='default'>
            {t('common:confirm')}
          </Button>
        }
      >
        <Alert message='Oops!!!' description={errorMessage} type='error' showIcon />
      </Modal>
      {/* Ship service modal */}
      <Modal
        onCancel={() => setOpenShipServiceModal(false)}
        title={t('purchase:shipUnit')}
        open={openShipServiceModal}
        footer={
          <Button onClick={() => setOpenShipServiceModal(false)} type='default'>
            {t('common:cancel')}
          </Button>
        }
      >
        {shipServices.map((service) => {
          return (
            <div
              key={service.service_id}
              className={`flex bg-primary flex-wrap justify-between mt-4 md:mt-0 border-s-4 my-2 px-2 rounded-sm py-3 cursor-pointer dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedShipService?.service_id === service.service_id &&
                'border-red-400 dark:border-red-500 bg-gray-100 dark:bg-gray-700'
              }`}
              onClick={() => setSelectedShipService(service)}
            >
              <div className='flex text-primary'>
                <div>
                  <div className='pb-1 text-base'>{service.short_name}</div>
                  <div className='text-xs text-gray-500'>{`${t('purchase:estimateTime')}: ${
                    service.leadtime || ''
                  }`}</div>
                </div>
              </div>
              <div className='text-red-500'>{formatCurrency(service.total as number)}</div>
            </div>
          )
        })}
        <div className='mt-4'>
          <span className='me-1 text-red-500'>{t('common:note')}</span>
          <span className=''>{t('purchase:shipNote')}</span>
        </div>
      </Modal>
    </div>
  )
}

export default Purchase
