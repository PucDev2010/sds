import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

import { CartProduct } from '~/types/product.type'
import { getProductAttributePrice } from '~/utils/product.utils'
import { formatCurrency } from '~/utils/utils'

function OrderItem({ orderProduct }: { orderProduct: CartProduct }) {
  const { t } = useTranslation()
  const { quantity, product, productAttribute } = orderProduct
  const { name, thumbnail } = product
  const { size, color } = productAttribute
  return (
    <div className='text-primary border-t w-full px-1 md:px-8 py-3 bg-primary relative'>
      <Row className='items-center'>
        <Col xs={6} lg={2}>
          <div className='flex-1 p-2 md:py-2 md:px-6'>
            <div className='flex items-center'>
              <img src={thumbnail} alt='img' className='object-contain' />
            </div>
          </div>
        </Col>
        <Col xs={18} lg={22}>
          <Row gutter={[8, 8]} className='items-center'>
            <Col lg={6} md={24}>
              <div className='flex items-center'>
                <div className='line-clamp-1 md:line-clamp-2'>{name}</div>
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
                <div className='flex-1 hidden lg:flex flex-col items-start lg:items-center justify-center my-1'>
                  <div className='text-red-500'>{formatCurrency(getProductAttributePrice(productAttribute))}</div>
                </div>
                <div className='flex-1 flex flex-col items-start lg:items-center justify-center my-1'>x{quantity}</div>
                <div className=' lg:flex flex-1  flex-col items-start lg:items-center justify-center my-1'>
                  <div className='text-red-500'>
                    {formatCurrency(getProductAttributePrice(productAttribute) * quantity)}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default OrderItem
