import { Button, InputNumber } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '~/constant/path'
import useQueryConfig from '~/hooks/useQueryConfig'
import { formatCurrency } from '~/utils/utils'

const PriceFilter = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const queryConfig = useQueryConfig(16)
  const { t } = useTranslation()
  const [rangePrice, setRangePrice] = useState<{ min: number | null; max: number | null }>({ min: null, max: null })
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const handleFilter = () => {
    if (!rangePrice.min || !rangePrice.max) {
      setErrorMessage(t('message:infomationRequired'))
    } else if (rangePrice.min > rangePrice.max) {
      setErrorMessage(t('message:invalidFilterPrice'))
    } else {
      setErrorMessage('')
      navigate({
        pathname: path.products,
        search: createSearchParams({
          ...queryConfig,
          minPrice: rangePrice.min.toString(),
          maxPrice: rangePrice.max.toString(),
          page: '0'
        }).toString()
      })
    }
  }
  const handleChange = (key: string, value: number | null) => {
    setRangePrice((prev) => ({ ...prev, [key]: value }))
  }
  return (
    <div>
      <div className='flex items-center'>
        <InputNumber
          value={rangePrice.min}
          onChange={(value) => handleChange('min', value)}
          min={0}
          formatter={(value) => (!!value ? formatCurrency(value) : '')}
          parser={(value) => (!!value ? parseInt(value.replaceAll('.', '')) : 0)}
          className='flex-1'
          placeholder={t('products:from')}
        />
        <div className='px-2'>-</div>
        <InputNumber
          value={rangePrice.max}
          onChange={(value) => handleChange('max', value)}
          min={0}
          formatter={(value) => (!!value ? formatCurrency(value) : '')}
          parser={(value) => (!!value ? parseInt(value.replaceAll('.', '')) : 0)}
          className='flex-1'
          placeholder={t('products:to')}
        />
      </div>
      {errorMessage && <div className='text-red-500 mt-1 text-xs'>{errorMessage}</div>}
      <div className='mt-4 flex justify-center'>
        <Button onClick={handleFilter} className='w-full' type='primary' danger>
          {t('common:apply')}
        </Button>
      </div>
      <button onClick={() => setRangePrice({ min: null, max: null })} className='hidden' ref={ref}></button>
    </div>
  )
})

export default PriceFilter
