import { useQuery } from '@tanstack/react-query'
import { Col, Empty, Pagination, Row, Spin, FloatButton } from 'antd'
import { useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import productApi from '~/api/product.api'
import ProductCard from '~/components/ProductCard/ProductCard'
import QueryKey from '~/constant/queryKey'
import useQueryConfig from '~/hooks/useQueryConfig'
import { Page } from '~/types/page.type'
import { Product } from '~/types/product.type'
import path from '~/constant/path'

function PageProduct() {
  const navigate = useNavigate()
  const [pageProducts, setPageProducts] = useState<Page<Product>>({
    currentPage: 0,
    totalPage: 0,
    datas: [],
    pageSize: 0,
    totalItems: 0
  })
  const queryConfig = useQueryConfig(16)

  const fetchFilterProducts = useQuery({
    queryKey: [QueryKey.fetchFilterProduct, queryConfig],
    queryFn: () => {
      return productApi.filterProducts(queryConfig)
    },
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (fetchFilterProducts.data) {
      setPageProducts(fetchFilterProducts.data.data.data)
    }
  }, [fetchFilterProducts.data])

  if (fetchFilterProducts.isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Spin tip={'Loading'}></Spin>
      </div>
    )
  }

  if (pageProducts.datas.length === 0) {
    return (
      <div className='flex justify-center'>
        <Empty />
      </div>
    )
  }

  return (
    <>
      <Row>
        {pageProducts.datas.map((product) => {
          return (
            <Col key={product.id} lg={8} xl={6} md={6} sm={8} xs={12}>
              <ProductCard product={product} />
            </Col>
          )
        })}
      </Row>
      <div className='flex justify-center mt-2'>
        {pageProducts.totalPage > 0 && (
          <Pagination
            showSizeChanger={false}
            current={pageProducts.currentPage + 1}
            defaultCurrent={1}
            pageSize={pageProducts.pageSize}
            total={pageProducts.totalItems}
            onChange={(page) => {
              if ((page - 1).toString() !== queryConfig?.page) {
                navigate({
                  pathname: path.products,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                })
              }
              window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
              })
            }}
          />
        )}
      </div>
      <FloatButton.BackTop />
    </>
  )
}

export default PageProduct
