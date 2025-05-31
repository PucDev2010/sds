import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Col, Row, Skeleton, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, Link, useParams } from 'react-router-dom'

import productApi from '~/api/product.api'
import path from '~/constant/path'
import QueryKey from '~/constant/queryKey'
import { Product } from '~/types/product.type'
import { getIdFromNameId } from '~/utils/utils'
import ProductImage from './components/ProductImage'
import ProductInfomation from './components/ProductInfomation'
import UserRating from './components/UserRating'

function ProductDetail() {
  const { name } = useParams()
  const { t } = useTranslation()
  const id = getIdFromNameId(name as string)
  const [product, setProduct] = useState<Product>()
  const fetchProduct = useQuery({
    queryKey: [QueryKey.fetchProduct, id],
    queryFn: () => {
      return productApi.fetchProductById(id)
    },
    staleTime: 3 * 60 * 1000,
    retry: 1
  })

  useEffect(() => {
    if (fetchProduct.data) {
      setProduct(fetchProduct.data.data.data)
    }
  }, [fetchProduct.data])

  return (
    <div className='layout-padding mb-4'>
      {product && (
        <div className='py-6 px-2'>
          <Breadcrumb
            items={[
              {
                title: <Link to={path.home}>{t('mainLayout:navHome')}</Link>
              },
              {
                title: (
                  <Link
                    to={{
                      pathname: path.products,
                      search: createSearchParams({ categories: product.category.id.toString() }).toString()
                    }}
                  >
                    {product.category.name}
                  </Link>
                )
              },
              {
                title: product.name
              }
            ]}
          />
        </div>
      )}
      <div className='bg-primary px-2 py-2'>
        <Row gutter={[8, 8]}>
          <Col xs={24} md={10} lg={10} xl={10}>
            {product ? (
              <ProductImage thumbnail={product.thumbnail} images={product.productImages} />
            ) : (
              <div className='flex justify-center h-full w-full'>
                <Skeleton.Image
                  rootClassName='w-full flex-1'
                  style={{ width: '100%', height: '100%', minHeight: '400px' }}
                  active={fetchProduct.isLoading}
                ></Skeleton.Image>
              </div>
            )}
          </Col>
          <Col xs={24} md={14} lg={14} xl={14}>
            {product ? (
              <ProductInfomation product={product} />
            ) : (
              <>
                <Skeleton active={fetchProduct.isLoading} loading={fetchProduct.isLoading}></Skeleton>
                <br />
                <Skeleton active={fetchProduct.isLoading} loading={fetchProduct.isLoading}></Skeleton>
                <br />
              </>
            )}
          </Col>
        </Row>
      </div>
      <div className='py-2 md:py-4 px-2 md:px-4 my-2 md:my-4 bg-primary text-primary'>
        <div className='text-xl py-2 mb-2'>{t('productDetail:productDescription')}</div>
        {product && <div dangerouslySetInnerHTML={{ __html: product.productDescription?.description || '' }}></div>}
      </div>
      {product && product.id && <UserRating rate={product.rate} productId={product.id} />}
    </div>
  )
}

export default ProductDetail
