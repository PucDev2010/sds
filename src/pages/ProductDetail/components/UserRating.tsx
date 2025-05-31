import { useQuery } from '@tanstack/react-query'
import { Avatar, Button, Empty, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { rateApi } from '~/api/rate.api'
import ProductRating from '~/components/ProductRating'
import QueryKey from '~/constant/queryKey'
import { Page } from '~/types/page.type'
import { Rate } from '~/types/rate.type'
import { getColorByName, handleError } from '~/utils/utils'

const defaultSize = 10
function UserRating({ productId, rate }: { productId: number; rate: number }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [ratePoint, setRatePoint] = useState<number | undefined>()
  const [pageRating, setPageRating] = useState<Page<Rate> | undefined>()
  const fetchRating = useQuery({
    queryKey: [QueryKey.fetchRate, productId, ratePoint],
    queryFn: () => {
      return rateApi.fetchProductRate({ productId, page, ratePoint, size: defaultSize })
    },

    onError: (err) => {
      handleError(err)
    },
    staleTime: 10 * 60 * 1000
  })

  useEffect(() => {
    if (fetchRating.data) {
      if (fetchRating.data.data.success) {
        setPageRating(fetchRating.data.data.data)
      }
    }
  }, [fetchRating.data])

  const handlFilterByStart = (ratePoint: number | undefined) => {
    setRatePoint(ratePoint)
  }

  return (
    <div className='py-2 md:py-4 px-2 md:px-4 my-2 md:my-4 bg-primary text-primary'>
      <div className='text-xl py-2 mb-2'>{t('productDetail:productReview')}</div>
      <div className='flex items-start py-3 md:py-6 px-2 md:px-6 lg:py-8 mb-2 bg-primary bg-red-50 border border-red-400'>
        <div className='me-4 md:me-8'>
          <div className='text-red-600 mb-3'>
            <span className='text-4xl'>{rate}</span>
            <span className='text-xl'>{` ${t('productDetail:per')} 5`}</span>
          </div>
          <ProductRating
            rating={rate}
            showTotalRate={false}
            activeClassname='h-4 w-4 fill-red-600'
            nonActiveClassname='h-4 w-4 fill-current text-white stroke-red-500 dark:text-gray-800'
          />
        </div>
        <div className='flex-1'>
          <Button
            onClick={() => handlFilterByStart(undefined)}
            danger={!!!ratePoint}
            className='me-2 mb-2'
            type='default'
          >
            {t('productDetail:all')}
          </Button>
          {Array(5)
            .fill(5)
            .map((value, index) => {
              return (
                <Button
                  onClick={() => handlFilterByStart(value - index)}
                  key={index}
                  danger={ratePoint === value - index}
                  className='me-2 mb-2'
                  type='default'
                >
                  {`${value - index} ${t('productDetail:star')}`}
                </Button>
              )
            })}
        </div>
      </div>
      {/* Render rating */}
      {pageRating && pageRating.datas.length > 0 ? (
        <div>
          <div className='my-2 text-primary text-base font-semibold'>
            {`${t('productDetail:total')}: ${pageRating.totalItems} ${t('common:rate')}`}
          </div>
          {pageRating.datas.map((rating) => {
            return (
              <div className='flex py-2 px-2 md:py-3 md:px-3 border-b ' key={rating.id}>
                <Avatar
                  style={{ backgroundColor: getColorByName(rating.username), verticalAlign: 'middle' }}
                  size='large'
                >
                  {rating.username.charAt(0).toUpperCase()}
                </Avatar>
                <div className='flex-1 ms-2 md:ms-6'>
                  <div className='mb-2 font-semibold'>{rating.username}</div>
                  <div className='mb-2'>{rating.createdAt}</div>
                  <ProductRating
                    rating={rating.ratePoint}
                    showTotalRate={false}
                    activeClassname='h-3 w-3 fill-red-600'
                    nonActiveClassname='h-3 w-3 fill-current text-white stroke-red-500 dark:text-gray-800'
                  />
                  <div className='mt-2'>{rating.content}</div>
                </div>
              </div>
            )
          })}
          <div className='my-4 md:my-6 flex justify-end'>
            <Pagination defaultCurrent={1} current={page + 1} showSizeChanger={false} total={pageRating.totalItems} />
          </div>
        </div>
      ) : (
        <div>
          <Empty />
        </div>
      )}
    </div>
  )
}

export default UserRating
