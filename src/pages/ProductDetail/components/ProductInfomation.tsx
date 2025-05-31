import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { uniqBy, findIndex } from 'lodash'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, InputNumber, message } from 'antd'

import { ProductAttribute } from '~/types/product.attribute.type'
import { Product } from '~/types/product.type'
import { Size } from '~/types/size.type'
import ProductPrice from './ProductPrice'
import ProductRateAndSold from './ProductRateAndSold'
import { getProductAttributePrice } from '~/utils/product.utils'
import { addToCart } from '~/slices/cartSlice'
import { RootState, useAppDispatch } from '~/store/store'
import { handleError } from '~/utils/utils'
import path from '~/constant/path'
import SizeItem from './SizeItem'
import Attribute from './Attribute'
import LoginLink from '~/components/LoginLink'

type ProductInfomationProps = {
  product: Product
}

type ProductDetailEvent = 'addToCart' | 'buyNow'

const initialError = { isError: false, message: '' }
function ProductInfomation({ product }: ProductInfomationProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<{ isError: boolean; message: string }>(initialError)
  const { name, rate, totalRate, sold, minPrice, maxPrice, salePercent, productAttributes } = product
  const { cart } = useSelector((root: RootState) => root.cart)
  const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(false)
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false)

  const navigate = useNavigate()

  let sizes = productAttributes?.map((item) => item.size) || []
  sizes = uniqBy(sizes, (size) => {
    return size.id
  })

  const [activeSize, setActiveSize] = useState<Size | null>(sizes.at(0) || null)
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(productAttributes?.at(0) || null)

  const handleSelectSize = (size: Size) => {
    setActiveSize(size)
    setSelectedAttribute(null)
    setQuantity(1)
  }

  const handleSelectColor = (attr: ProductAttribute) => {
    setSelectedAttribute(attr)
    setQuantity(1)
  }

  const goToCart = (id: number) => {
    navigate(`${path.cart}?ids=${id}`)
  }

  const findIndexOfItemExistInCart = () => {
    if (selectedAttribute) {
      return findIndex(cart, {
        product: { id: product.id },
        productAttribute: { id: selectedAttribute.id }
      })
    } else {
      // -2 is not selectedAttribute
      return -2
    }
  }

  const isValidate = () => {
    if (!selectedAttribute) {
      setError({ isError: true, message: t('productDetail:errorNoProductSelected') })
      disableLoading()
      return false
    } else {
      const index = findIndexOfItemExistInCart()
      if (selectedAttribute.stock === 0) {
        disableLoading()
        setError({ isError: true, message: t('cart:product') + ' ' + t('cart:outOfStock') })
        return false
      } else if (index > -1 && quantity + cart[index].quantity > selectedAttribute.stock) {
        disableLoading()
        setError({ isError: true, message: t('productDetail:errorProductOutOfQuantity') })
        return false
      }
      return true
    }
  }

  const handleEvent = (eventName: ProductDetailEvent) => {
    if (isValidate()) {
      setError({ isError: false, message: '' })
      dispatch(
        addToCart({
          quantity: quantity,
          product: product,
          productAttribute: selectedAttribute as ProductAttribute
        })
      )
        .unwrap()
        .then((res) => {
          if (!res.success) {
            if (isLoadingAddToCart) {
              setIsLoadingAddToCart(false)
            }
            if (isLoadingBuyNow) {
              setIsLoadingBuyNow(false)
            }
            message.error(res.message)
          } else {
            if (eventName === 'buyNow') {
              setIsLoadingBuyNow(false)
              const id = res.data.id as number
              goToCart(id)
            } else {
              setIsLoadingAddToCart(false)
              message.success(res.message)
            }
          }
        })
        .catch((err) => {
          disableLoading()
          handleError(err)
        })
    } else {
    }
  }
  const disableLoading = () => {
    setIsLoadingBuyNow(false)
    setIsLoadingAddToCart(false)
  }
  const handleAddToCart = () => {
    setIsLoadingAddToCart(true)
    handleEvent('addToCart')
  }

  const handleBuyNow = () => {
    const index = findIndexOfItemExistInCart()
    if (index > -1) {
      const id = cart[index].id as number
      goToCart(id)
    } else if (index === -2) {
      setError({ isError: true, message: t('productDetail:errorNoProductSelected') })
    } else if (index === -1) {
      setIsLoadingBuyNow(true)
      handleEvent('buyNow')
    }
  }

  return (
    <div className='text-primary bg-primary h-full md:py-6 lg:py-8 py-4'>
      <h3 className='text-2xl px-2 md:px-8'>{name}</h3>
      <div className='flex py-2 my-2 bg-gray-50 dark:bg-transparent px-2 md:px-8 flex-wrap'>
        <div className='flex text-base pe-5 border-e-2 border-gray-400'>SKU: {product.sku}</div>
        <div className='flex ms-4 items-end pe-5'>
          {t('common:brands')}: {product.brand.name}
        </div>
      </div>
      <ProductRateAndSold rate={rate} sold={sold} totalRate={totalRate} />
      <ProductPrice
        minPrice={selectedAttribute ? getProductAttributePrice(selectedAttribute) : minPrice}
        maxPrice={selectedAttribute ? getProductAttributePrice(selectedAttribute) : maxPrice}
        sale={!!selectedAttribute ? selectedAttribute.discount : salePercent}
        origin={!!selectedAttribute ? selectedAttribute.price : 0}
      />
      <div className='px-2 md:px-8'>
        <h3 className='text-primary mb-2'>{t('productDetail:size')}:</h3>
        <div className='flex flex-wrap'>
          {sizes.length > 0 &&
            sizes.map((size) => (
              <SizeItem
                onClick={() => handleSelectSize(size)}
                active={!!activeSize && activeSize?.id === size.id}
                key={size.id}
                size={size}
              />
            ))}
        </div>
      </div>
      <div className='px-2 md:px-8 mt-6'>
        <h3 className='text-primary mb-2'>{t('productDetail:color')}:</h3>
        <div className='flex flex-wrap'>
          {activeSize &&
            productAttributes
              ?.filter((attr) => attr.size.id === activeSize.id)
              .map((attr) => {
                return (
                  <Attribute
                    onClick={() => handleSelectColor(attr)}
                    active={!!selectedAttribute && selectedAttribute.id === attr.id}
                    key={attr.id}
                    attribute={attr}
                  />
                )
              })}
        </div>
      </div>
      <div className='px-2 md:px-8 mt-6'>
        <h3 className='text-primary mb-2'>{t('common:quantity')}:</h3>
        <div className='flex items-end flex-wrap'>
          <InputNumber
            onChange={(value) => setQuantity(value || 1)}
            value={quantity}
            min={1}
            max={selectedAttribute?.stock || 1}
          />
          {selectedAttribute && (
            <div className='ms-3 text-primary text-gray-600 font-semibold'>{`${selectedAttribute.stock} ${t(
              'productDetail:stock'
            )}`}</div>
          )}
        </div>
      </div>
      <div className='px-2 md:px-8 mt-6'>
        {isAuthenticated ? (
          <>
            <Button
              onClick={handleAddToCart}
              size='large'
              loading={isLoadingAddToCart}
              disabled={isLoadingAddToCart}
              icon={<ShoppingCartOutlined />}
              className={'me-2'}
            >
              {t('productDetail:addToCart')}
            </Button>
            <Button onClick={handleBuyNow} loading={isLoadingBuyNow} disabled={isLoadingBuyNow} size='large'>
              {t('productDetail:buyNow')}
            </Button>
          </>
        ) : (
          <>
            <LoginLink>
              <Button size='large' icon={<ShoppingCartOutlined />} className={'me-2'}>
                {t('productDetail:addToCart')}
              </Button>
            </LoginLink>

            <LoginLink>
              <Button size='large'>{t('productDetail:buyNow')}</Button>
            </LoginLink>
          </>
        )}
      </div>
      {error.isError && (
        <div className='px-2 md:px-8 mt-6'>
          <Alert message={error.message} type='error' showIcon />
        </div>
      )}
    </div>
  )
}

export default ProductInfomation
