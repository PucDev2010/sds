import { useTranslation } from 'react-i18next'
import { FilterOutlined, CloseOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Collapse, Tooltip } from 'antd'

import { CommonData, initialCommonData } from '~/types/common.type'
import useFetchCommonData from '~/hooks/useFetchCommonData'
import RatingFilter from '../RatingFilter'
import useQueryConfig, { QueryConfig, defaultPaginationProduct } from '~/hooks/useQueryConfig'
import PriceFilter from '../PriceFilter'
import StatusFilter from '../StatusFilter'
import BrandFilter from '../BrandFilter'
import CategoryFilter from '../CategoryFilter'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '~/constant/path'

const { Panel } = Collapse
function Aside() {
  const { t } = useTranslation()
  const [commonData, setCommonData] = useState<CommonData>(initialCommonData)
  const clearFilterPriceBtnRef = React.createRef<HTMLButtonElement>()
  const clearFilterCategoryBtnRef = React.createRef<HTMLButtonElement>()
  const clearFilterBrandBtnRef = React.createRef<HTMLButtonElement>()

  const navigate = useNavigate()
  const fetchCommonData = useFetchCommonData()
  useEffect(() => {
    if (fetchCommonData.data) {
      const [categories, brands] = fetchCommonData.data
      setCommonData({ categories, brands })
    }
  }, [fetchCommonData.data])

  const handleClear = () => {
    navigate({
      pathname: path.products,
      search: createSearchParams({ page: '0', pageSize: '16' }).toString()
    })
    clearFilterPriceBtnRef.current?.click()
    clearFilterCategoryBtnRef.current?.click()
    clearFilterBrandBtnRef.current?.click()
  }

  return (
    <div className='min-h-screen'>
      <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
        <Panel
          header={
            <div className='flex justify-between items-center'>
              <div className='flex text-primary text-base font-semibold'>
                <FilterOutlined />
                <div className='ms-1'>{t('products:filter')}</div>
              </div>
              <Tooltip title={t('products:clearFilter')}>
                <div
                  onClick={handleClear}
                  className='w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
                >
                  <CloseOutlined />
                </div>
              </Tooltip>
            </div>
          }
          showArrow={false}
          collapsible='icon'
          key='0'
        ></Panel>
        <Panel header={t('common:categories')} key='1'>
          <CategoryFilter ref={clearFilterCategoryBtnRef} categories={commonData.categories} />
        </Panel>
        <Panel header={t('common:brands')} key='2'>
          <BrandFilter ref={clearFilterBrandBtnRef} brands={commonData.brands} />
        </Panel>
        <Panel header={t('common:rate')} key='3'>
          <RatingFilter />
        </Panel>
        <Panel header={t('common:status')} key='4'>
          <StatusFilter />
        </Panel>
        <Panel header={t('cart:price')} key='5'>
          <PriceFilter ref={clearFilterPriceBtnRef} />
        </Panel>
      </Collapse>
    </div>
  )
}

export default Aside
