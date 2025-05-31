import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'antd'
import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import productApi from '~/api/product.api'
import ProductCard from '~/components/ProductCard/ProductCard'
import SlickCarousel from '~/components/SlickCarousel/SlickCarousel'
import { QueryConfig } from '~/hooks/useQueryConfig'
import { Product } from '~/types/product.type'

type ListProductProps = {
  queryConfig: QueryConfig
  queryKey: string
}

function ListProductCarousel({ queryConfig, queryKey }: ListProductProps) {
  const [products, setProducts] = useState<Product[]>([])
  const getProducts = useQuery({
    queryKey: [queryKey],
    queryFn: () => {
      return productApi.filterProducts(queryConfig)
    },
    staleTime: 5 * 60 * 1000,
    onError: (err: AxiosError) => {
      console.error(err.message)
    }
  })
  const reponsiveSetting = useMemo(() => {
    return {
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinity: products.length > 2
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinity: products.length > 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinity: products.length > 3
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinity: products.length > 4
          }
        }
      ]
    }
  }, [products])
  useEffect(() => {
    if (getProducts?.data) {
      setProducts(getProducts.data.data.data.datas)
    }
  }, [getProducts.data])
  return (
    <div className='layout-padding mt-2'>
      <Skeleton loading={getProducts.isLoading} active>
        {products.length > 0 && (
          <SlickCarousel
            setting={{
              infinite: products.length > 6,
              ...reponsiveSetting
            }}
            alignLeft
          >
            {products.map((product) => {
              return <ProductCard key={product.id} product={product} />
            })}
          </SlickCarousel>
        )}
      </Skeleton>
    </div>
  )
}

export default ListProductCarousel
