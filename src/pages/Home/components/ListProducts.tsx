import { useQuery } from '@tanstack/react-query'
import { Button, Col, Row, Skeleton } from 'antd'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import productApi from '~/api/product.api'
import ProductCard from '~/components/ProductCard/ProductCard'
import QueryKey from '~/constant/queryKey'
import { defaultPaginationProduct, QueryConfig } from '~/hooks/useQueryConfig'
import { Page } from '~/types/page.type'
import { Product } from '~/types/product.type'
import { PageRequest } from '~/types/utils.type'
import { toPageQuery } from '~/utils/utils'

const initialPageRequest = {
  page: parseInt(defaultPaginationProduct.page),
  pageSize: parseInt(defaultPaginationProduct.pageSize)
}
type ListProductProps = {
  children?: React.ReactNode
  queryParams?: QueryConfig
}
function ListProduct({ children, queryParams }: ListProductProps) {
  const { t } = useTranslation()
  const [pageProducts, setPageProducts] = useState<Page<Product>>()
  const [pageRequest, setPageRequest] = useState<PageRequest>(initialPageRequest)
  const getProducts = useQuery({
    queryKey: [QueryKey.fetchNewProduct, pageRequest, queryParams],
    queryFn: () => {
      return productApi.filterProducts({ ...toPageQuery(pageRequest), ...queryParams })
    },
    staleTime: 5 * 60 * 1000,
    onError: (err: AxiosError) => {
      console.error(err.message)
    }
  })

  useEffect(() => {
    if (getProducts?.data) {
      setPageProducts((prev) => {
        if (prev) {
          return { ...getProducts.data.data.data, datas: [...prev?.datas, ...getProducts.data.data.data.datas] }
        } else {
          return getProducts.data.data.data
        }
      })
    }
  }, [getProducts.data])

  const handleShowMoreProducts = () => {
    if (pageProducts) {
      if (pageProducts.totalPage - 1 > pageRequest.page) {
        setPageRequest((prev) => ({ ...prev, page: prev.page + 1 }))
      }
    }
  }
  return (
    <div className='layout-padding mt-5'>
      {children}
      <Row>
        {pageProducts?.datas.map((product) => {
          return (
            <Col xs={12} md={6} lg={6} xl={4} key={product.id}>
              <ProductCard product={product} />
            </Col>
          )
        })}
      </Row>
      {pageProducts && pageProducts.totalPage - 1 > pageRequest.page && (
        <div className='flex items-center justify-center mt-1'>
          <Button onClick={handleShowMoreProducts}>{t('common:showMore')}</Button>
        </div>
      )}
      <Skeleton loading={getProducts.isLoading} active={getProducts.isLoading}></Skeleton>
    </div>
  )
}

export default ListProduct
