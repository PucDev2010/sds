import { useQuery } from '@tanstack/react-query'
import { Col, Empty, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import productApi from '~/api/product.api'
import ProductCard from '~/components/ProductCard/ProductCard'
import VoucherItem from '~/components/VoucherItem'
import QueryKey from '~/constant/queryKey'

function ProductVoucher() {
  const { state } = useLocation()
  const { t } = useTranslation()
  const { isLoading, data } = useQuery({
    queryKey: [QueryKey.fetchProductVoucher, state?.voucher?.code],
    queryFn: () => {
      return productApi.fetchProductByVoucher(state?.voucher?.productIds as string)
    },
    enabled: !!state.voucher,
    staleTime: 10 * 60 * 1000
  })
  return (
    <div className='layout-padding my-4 '>
      {!!!state?.voucher ? (
        <Empty />
      ) : (
        <div className='bg-primary text-primary rounded-md shadow-sm py-4 min-h-screen'>
          <div className='flex justify-center'>
            <div className='max-w-xl'>
              <VoucherItem footer={null} voucher={state.voucher} />
            </div>
          </div>
          <div className='px-4'>
            <div className='border-b-2 mt-8 relative'>
              <div className='absolute text-lg text-primary text-gray-500 bg-primary px-2 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                {t('coupon:applyProduct')}
              </div>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className='flex py-16 justify-center'>
                <Spin />
              </div>
            ) : (
              <div className='mt-4'>
                <Row>
                  {data &&
                    data.data?.data?.map((product) => (
                      <Col xs={12} sm={8} md={6} lg={6} xl={4} key={product.id}>
                        <ProductCard product={product} />
                      </Col>
                    ))}
                </Row>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductVoucher
