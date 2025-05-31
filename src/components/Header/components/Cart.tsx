import { Badge, Button, Empty, Popover } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import HeaderIcon from './HeaderIcon'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { Link } from 'react-router-dom'

import { CartProduct } from '~/types/product.type'
import { getProductAttributePrice } from '~/utils/product.utils'
import { formatCurrency, generateNameId } from '~/utils/utils'
import { useTranslation } from 'react-i18next'
import path from '~/constant/path'
import { useQuery } from '@tanstack/react-query'
import QueryKey from '~/constant/queryKey'
import cartApi from '~/api/cart.api'
import { renew } from '~/slices/cartSlice'
import { useDispatch } from 'react-redux'
import { AxiosError } from 'axios'
import LoginLink from '~/components/LoginLink'

const CartItem = ({ item }: { item: CartProduct }) => {
  const { t } = useTranslation()
  return (
    <Link
      to={`${path.product}/${generateNameId({ name: item.product.name, id: item.product.id.toString() })}`}
      className='flex items-center h-14 mb-2 hover:bg-gray-100 dark:hover:bg-gray-700'
    >
      <div className='h-14 w-14'>
        <img alt='img' src={item.product.thumbnail} className='aspect-square object-cover' />
      </div>
      <div className='flex flex-col flex-1 ps-2 py-1 justify-between h-full text-primary'>
        <div className='line-clamp-1 text-sm'>{item.product.name}</div>
        <div className='flex justify-between text-sm'>
          <div>{`${t('common:quantity')}: ${item.quantity}`}</div>
          <div>{formatCurrency(getProductAttributePrice(item.productAttribute))}</div>
        </div>
      </div>
    </Link>
  )
}

function Cart() {
  const { t } = useTranslation()
  const { cart } = useSelector((root: RootState) => root.cart)
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const dispatch = useDispatch()

  useQuery({
    queryKey: [QueryKey.fetchCart, isAuthenticated],
    queryFn: () => {
      if (isAuthenticated) {
        return cartApi.fetchCart()
      } else {
        return Promise.resolve(null)
      }
    },
    onSuccess: (res) => {
      if (res?.data.success) {
        dispatch(renew(res.data.data))
      }
    },
    retry: 0,
    onError: (err: AxiosError) => {
      console.error('Fetch cart items error:' + err.message)
    }
  })

  const total = useMemo(() => {
    return cart.reduce((prev, current) => prev + current.quantity, 0)
  }, [cart])
  const Content = () => {
    return (
      <div className='p-1 w-96 bg-primary text-primary shadow-sm'>
        <div style={{ maxHeight: '300px' }} className='overflow-y-auto'>
          {cart.length > 0 && cart.map((item) => <CartItem key={item.id} item={item} />)}
          {cart.length <= 0 && <Empty />}
        </div>
        <div className='mt-2 flex justify-end border-t pt-2'>
          {isAuthenticated ? (
            <Link to={path.cart}>
              <Button danger type='primary'>
                {t('mainLayout:showDetails')}
              </Button>
            </Link>
          ) : (
            <LoginLink>
              <Button danger type='primary'>
                {t('mainLayout:showDetails')}
              </Button>
            </LoginLink>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Popover content={<Content />} placement={'bottomRight'}>
        {isAuthenticated ? (
          <button>
            <HeaderIcon
              to={path.cart}
              icon={
                <Badge count={total} showZero={false} offset={[2, -3]}>
                  <ShoppingCartOutlined style={{ fontSize: '1.3rem' }} />
                </Badge>
              }
            />
          </button>
        ) : (
          <LoginLink>
            <HeaderIcon icon={<ShoppingCartOutlined style={{ fontSize: '1.3rem' }} />} />
          </LoginLink>
        )}
      </Popover>
    </div>
  )
}

export default Cart
