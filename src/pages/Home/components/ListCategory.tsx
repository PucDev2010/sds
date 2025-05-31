import { Skeleton } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { createSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CategoryIcon from '~/components/CustomIcon/CategoryIcon'
import Overlay from '~/components/Overlay'
import SlickCarousel from '~/components/SlickCarousel/SlickCarousel'
import path from '~/constant/path'
import useFetchCommonData from '~/hooks/useFetchCommonData'
import { defaultPaginationProduct } from '~/hooks/useQueryConfig'
import { getImageUrl } from '~/utils/utils'
import { Category } from '~/types/category.type'

function ListCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const { t } = useTranslation()
  const fetchCommonData = useFetchCommonData()
  useEffect(() => {
    if (fetchCommonData.data) {
      const [categories] = fetchCommonData.data
      setCategories(categories)
    }
  }, [fetchCommonData.data])
  const responsiveSetting = useMemo(() => {
    return [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          inifinity: categories.length > 2 || false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          inifinity: categories.length > 2 || false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          inifinity: categories.length > 4 || false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          inifinity: categories.length > 6 || false
        }
      }
    ]
  }, [categories])
  return (
    <div className='layout-padding mt-5'>
      <div className='flex items-center py-2 ps-2'>
        <CategoryIcon style={{ fontSize: '2rem' }} className='text-blue-600 me-2 text-primary' />
        <h3 className='text-2xl font-semibold text-primary'>{t('common:categories')}</h3>
      </div>
      <Skeleton loading={fetchCommonData.isLoading} active>
        {categories.length > 0 && (
          <SlickCarousel alignLeft setting={{ infinite: categories?.length > 5, responsive: responsiveSetting }}>
            {categories
              .filter((item) => !!item.parentId)
              .map((item) => {
                return (
                  <Link
                    key={item.id}
                    to={{
                      pathname: path.products,
                      search: createSearchParams({
                        ...defaultPaginationProduct,
                        categories: item.id?.toString() || ''
                      }).toString()
                    }}
                  >
                    <div className='p-2'>
                      <div className='border p-2 rounded-md overflow-hidden border-gray-300 hover:shadow-sm hover:shadow-blue-300 dark:shadow-white text-primary bg-primary '>
                        <div className=' relative group'>
                          <img src={getImageUrl(item.image || '')} className='aspect-square' />
                          <Overlay mode='hover' />
                        </div>
                        <div className='text-center text-lg'>{item.name}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </SlickCarousel>
        )}
      </Skeleton>
    </div>
  )
}

export default ListCategory
