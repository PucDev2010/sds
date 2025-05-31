import { Button, Checkbox, Col, InputNumber, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import useQueryConfig from '~/hooks/useQueryConfig'
import { CartProduct } from '~/types/product.type'
import { getProductAttributePrice } from '~/utils/product.utils'
import { formatCurrency } from '~/utils/utils'

function CartItem({
  cartProduct,
  selectedProductIds,
  onCheckProduct,
  onProductQuantityChange,
  onDeleteCartItem
}: {
  cartProduct: CartProduct
  selectedProductIds: number[]
  onCheckProduct: (id: number) => void
  onProductQuantityChange: (id: number, quantity: number) => void
  onDeleteCartItem: (id: number) => void
}) {
  const { t } = useTranslation()
  const { id, quantity, product, productAttribute } = cartProduct
  const { name, thumbnail } = product
  const { size, color, stock } = productAttribute

  return (
    <div className='text-primary border-t w-full px-1 md:px-8 py-3 bg-primary relative'>
      <Row className='items-start md:items-center'>
        <Col xs={8} lg={2}>
          <div className='flex items-center'>
            <Checkbox
              checked={selectedProductIds.includes(id as number)}
              disabled={quantity === 0}
              onChange={() => {
                onCheckProduct(id as number)
              }}
            ></Checkbox>
            <div className='flex-1 p-2 md:p-6 lg:px-2 lg:py-6'>
              <img src={thumbnail} alt='img' className='object-contain' />
            </div>
          </div>
        </Col>
        <Col xs={16} lg={22}>
          <Row gutter={[8, 8]} className='items-center'>
            <Col lg={6} md={24}>
              <div className='flex items-center'>
                <div className='line-clamp-1 md:line-clamp-3'>{name}</div>
              </div>
            </Col>
            <Col lg={18} md={24}>
              <div className='lg:flex '>
                <div className='flex-1 flex flex-row flex-wrap justify-start lg:justify-center lg:flex-col items-start lg:items-center  my-1'>
                  <div>
                    {t('cart:size')}: <span className='inline-block me-1 md:ms-1'>{size.name}</span>
                  </div>
                  <div className='block lg:hidden h-6 border-e-2 mx-2'></div>
                  <div>
                    {t('cart:color')}: <span className='inline-block me-1 md:ms-1'>{color.name}</span>
                  </div>
                </div>
                <div className='flex-1 flex flex-col items-start lg:items-center justify-center my-1'>
                  <div className='text-red-500'>{formatCurrency(getProductAttributePrice(productAttribute))}</div>
                </div>
                <div className='flex-1 flex flex-col items-start lg:items-center justify-center my-1'>
                  <div className='cart-input-number'>
                    <InputNumber
                      min={1}
                      max={stock}
                      value={quantity}
                      onChange={(quantity) => {
                        onProductQuantityChange(id as number, quantity as number)
                      }}
                      addonAfter={
                        <span
                          className='cursor-pointer w-full h-full block px-3 select-none'
                          onClick={() => {
                            if (quantity < stock) {
                              onProductQuantityChange(id as number, (quantity + 1) as number)
                            }
                          }}
                        >
                          +
                        </span>
                      }
                      addonBefore={
                        <span
                          className='cursor-pointer w-full h-full block px-3 select-none'
                          onClick={() => {
                            if (quantity === 1) {
                              onDeleteCartItem(id as number)
                            } else {
                              onProductQuantityChange(id as number, (quantity - 1) as number)
                            }
                          }}
                        >
                          -
                        </span>
                      }
                    />
                  </div>
                  <div className='text-sm dark:text-gray-300 text-gray-600 mt-1'>{`${t('cart:stock')}: ${stock}`}</div>
                </div>
                <div className='hidden lg:flex flex-1  flex-col items-start lg:items-center justify-center my-1'>
                  {formatCurrency(getProductAttributePrice(productAttribute) * quantity)}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {quantity <= 0 && (
        <div className='absolute top-0 left-0 bottom-0 right-0 bg-gray-300/50 flex items-center justify-center'>
          <div className='font-semibold text-lg text-red-500'>{t('cart:outOfStock')}</div>
          <Button onClick={() => onDeleteCartItem(id as number)} type='primary' danger>
            {t('cart:delete')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CartItem
