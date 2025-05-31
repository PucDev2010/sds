import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { Col, Row, Checkbox, Modal, Empty, Button, message } from 'antd'
import { find, findIndex } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import './cart.css'
import { removeItem, renew } from '~/slices/cartSlice'
import { getProductAttributePrice } from '~/utils/product.utils'
import { formatCurrency } from '~/utils/utils'
import CartItem from './components/CartItem'
import ApplyVoucher from '~/components/ApplyVoucher'
import TruckIcon from '~/components/CustomIcon/TruckIcon'
import { Voucher } from '~/types/voucher.type'
import { setPreOrder } from '~/slices/orderSlice'
import QueryKey from '~/constant/queryKey'
import cartApi from '~/api/cart.api'
import { AxiosError } from 'axios'
import LoadingModal from '~/components/Loading/LoadingModal'
import path from '~/constant/path'
import useQueryParams from '~/hooks/useQueryParams'
import { getVoucherDiscount } from '~/utils/voucher.utils'

function CartPage() {
  const { cart } = useSelector((root: RootState) => root.cart)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [products, setProducts] = useState(cart)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [open, setOpen] = useState(false)
  const [deletedId, setDeletedId] = useState<number>()
  const [voucher, setVoucher] = useState<Voucher>()
  const navigate = useNavigate()
  const params = useQueryParams()

  const renewCart = useQuery({
    queryKey: [QueryKey.fetchCart],
    queryFn: () => {
      return cartApi.fetchCart()
    },
    onSuccess: (res) => {
      if (res?.data.success) {
        dispatch(renew(res.data.data))
      }
    },
    onError: (err: AxiosError) => {
      console.error('Fetch cart items error:' + err.message)
    }
  })

  useEffect(() => {
    if (params?.ids && renewCart.data) {
      let cartItemIds = params.ids.split(',').map((item) => parseInt(item))
      let cartProducts = renewCart.data.data.data
      let j = 0
      for (let i = 0; i < cartProducts.length; i++) {
        if (cartItemIds.includes(cartProducts[i].id as number)) {
          const temp = { ...cartProducts[j] }
          cartProducts[j] = { ...cartProducts[i] }
          cartProducts[i] = { ...temp }
          j++
        }
      }
      setProducts(cartProducts)
      setSelectedProductIds(cartItemIds)
    }
  }, [params?.ids, renewCart.data])

  const handlePurchase = () => {
    if (selectedProductIds.length === 0) {
      message.error(t('message:orderItemNotEmpty'))
    } else {
      dispatch(
        setPreOrder({
          voucher: voucher,
          preOrderItems: products.filter((item) => selectedProductIds.includes(item.id as number))
        })
      )
      navigate(path.purchase)
    }
  }
  const handleCheckProduct = (id: number) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds((prev) => prev.filter((item) => item !== id))
    } else {
      setSelectedProductIds((prev) => [...prev, id])
    }
  }

  const isCheckedAll = () => {
    return selectedProductIds.length === products.filter((item) => item.quantity > 0).length
  }

  const handleCheckAll = () => {
    if (isCheckedAll()) {
      setSelectedProductIds([])
    } else {
      setSelectedProductIds(() => products.filter((item) => item.quantity > 0).map((item) => item.id as number))
    }
  }
  const handleProductQuantityChange = (id: number, quantity: number) => {
    if (quantity) {
      const index = findIndex(products, { id })
      if (index > -1) {
        const newProduct = [...products]
        newProduct[index] = { ...newProduct[index], quantity }
        setProducts(newProduct)
      }
    }
  }

  const handleDeleteCartItem = (id: number) => {
    if (id) {
      setDeletedId(id)
      setOpen(true)
    }
  }
  const handleConfirmRemoveItem = () => {
    setProducts((prev) => prev.filter((pro) => pro.id !== deletedId))
    setSelectedProductIds((prev) => prev.filter((id) => id !== deletedId))
    dispatch(removeItem(deletedId))
    setOpen(false)
  }

  const total = useMemo(() => {
    return products
      .filter((pro) => selectedProductIds.includes(pro.id as number))
      .reduce((acc, cur) => {
        return acc + getProductAttributePrice(cur.productAttribute) * cur.quantity
      }, 0)
  }, [products, selectedProductIds])

  const getTotalDiscout = () => {
    if (voucher) {
      return getVoucherDiscount(voucher, total, selectedProductIds, 0)
    }
    return 0
  }

  const getIdsForApplyVoucher = () => {
    let ids: number[] = []
    cart.forEach((cartItem) => {
      if (cartItem.id && selectedProductIds.includes(cartItem.id)) {
        ids.push(cartItem.product.id)
      }
    })
    return ids
  }

  if (cart.length === 0) {
    return (
      <div className='px-1 md:px-4 lg:px-6 xl:px-10 min-h-screen flex items-center justify-center'>
        <Empty />
      </div>
    )
  }
  return (
    <div className='px-1 md:px-4 lg:px-6 xl:px-10 mt-2'>
      <div className='px-1 md:px-8 py-2 bg-primary flex  my-2 border border-orange-400'>
        <TruckIcon style={{ fontSize: '1.2rem', color: 'rgb(0, 191, 165)' }} />
        <div className='ms-3 text-gray-600 dark:text-gray-200'>{t('cart:freeship')}</div>
      </div>
      <nav className='px-1 md:px-8 py-3 bg-primary'>
        <Row>
          <Col lg={2} md={24}>
            <Checkbox checked={isCheckedAll()} onChange={handleCheckAll}>
              <span className='text-base'>{t('cart:product')}</span>
            </Checkbox>
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
                  <div className='flex-1 text-center'>{t('cart:action')}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </nav>
      {/* Products */}
      {products.map((product) => {
        return (
          <CartItem
            cartProduct={product}
            key={product.id}
            onCheckProduct={handleCheckProduct}
            onDeleteCartItem={handleDeleteCartItem}
            onProductQuantityChange={handleProductQuantityChange}
            selectedProductIds={selectedProductIds}
          />
        )
      })}
      {/* PreOrder */}
      <div className='my-4 cart-shadow py-2 bg-primary '>
        <div className='px-1 md:px-8 py-2 border-b border-dashed flex justify-end'>
          <div className='flex flex-col items-end'>
            <ApplyVoucher
              onSelectedVoucher={(voucher) => setVoucher(voucher)}
              selectedVoucher={voucher}
              total={total}
              selectedProductIds={getIdsForApplyVoucher()}
            />
            {voucher && (
              <div className='text-xs text-red-500 pe-4'>
                {voucher.voucherType === 'free_ship' ? t('coupon:freeShipVoucher') : t('coupon:discountVoucher')}
              </div>
            )}
          </div>
        </div>
        <div className='px-1 md:px-8 py-1 flex justify-end'>
          <div className='w-3/4 md:w-1/2 lg:w-1/4'>
            <div className='flex justify-between py-1 text-gray-500'>
              <label className=''>{t('cart:total')}:</label>
              <div className='font-semibold'>
                {formatCurrency(total)}
                <span className='inline-block ms-1'>đ</span>
              </div>
            </div>
            <div className='flex justify-between py-1 text-gray-500'>
              <label className=''>{t('cart:discount')}:</label>
              <div className='font-semibold'>
                {formatCurrency(getTotalDiscout())}
                <span className='inline-block ms-1'>đ</span>
              </div>
            </div>
            <div className='flex justify-between py-1 text-gray-500 items-end'>
              <label className=''>{t('cart:totalPayment')}:</label>
              <div className='font-semibold text-red-500 text-3xl'>
                {formatCurrency(total - getTotalDiscout())}
                <span className='inline-block ms-1'>đ</span>
              </div>
            </div>
            <div className='flex justify-end pt-2'>
              <Button onClick={handlePurchase} type='primary'>
                {t('cart:purchase')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <LoadingModal loading={renewCart.isLoading} />
      <Modal
        title={t('cart:confirmRemoveItemTitle')}
        open={open}
        onOk={handleConfirmRemoveItem}
        onCancel={() => setOpen(false)}
        okText={t('common:confirm')}
        cancelText={t('common:cancel')}
        okType='danger'
      >
        <div>{find(products, { id: deletedId })?.product.name}</div>
      </Modal>
    </div>
  )
}

export default CartPage
