import { Radio, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import type { RadioChangeEvent } from 'antd'
import useQueryConfig, { QueryConfig, orderBy, sortBy } from '~/hooks/useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '~/constant/path'
import { omit } from 'lodash'

function StatusFilter() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryConfig = useQueryConfig(16)
  const handleStatusFilterChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      let newQueryConfig = { ...queryConfig, sale: 'true', page: '0' }
      if (newQueryConfig?.sortBy === sortBy.createdAt) {
        newQueryConfig = omit(newQueryConfig, 'sortBy', 'order')
      }
      navigate({
        pathname: path.products,
        search: createSearchParams(newQueryConfig).toString()
      })
    } else if (e.target.value === 2) {
      navigate({
        pathname: path.products,
        search: createSearchParams(
          omit({ ...queryConfig, sortBy: sortBy.createdAt, order: orderBy.desc }, 'sale')
        ).toString()
      })
    }
  }

  return (
    <Space direction='vertical'>
      <Radio onChange={handleStatusFilterChange} checked={!!queryConfig?.sale} value={1}>
        {t('products:statusSale')}
      </Radio>
      <Radio onChange={handleStatusFilterChange} checked={queryConfig?.sortBy === sortBy.createdAt} value={2}>
        {t('products:statusNewArrival')}
      </Radio>
    </Space>
  )
}

export default StatusFilter
