import { Button, Drawer, Dropdown, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { FilterOutlined } from '@ant-design/icons'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { DownOutlined, CheckOutlined } from '@ant-design/icons'

import path from '~/constant/path'
import useQueryConfig, { sortBy } from '~/hooks/useQueryConfig'
import { orderBy } from '~/hooks/useQueryConfig'
import { QueryConfig } from '~/hooks/useQueryConfig'
import { useEffect, useState } from 'react'
import Aside from '../Aside'

function Sorter() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const [open, setOpen] = useState(false)
  const getLabel = () => {
    let label = t('products:price')
    if (queryConfig?.sortBy === sortBy.price) {
      if (queryConfig?.order === orderBy.asc) {
        label = label + ': ' + t('products:lowToHight')
      } else {
        label = label + ': ' + t('products:hightToLow')
      }
    }
    return label
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div className='px-2 md:px-6 py-3 bg-primary text-primary bg-gray-200 flex justify-between items-center'>
        <div className='flex items-center '>
          <div className='hidden md:block me-2 text-base'>{t('products:sortBy')}</div>
          <Link
            to={{
              pathname: path.products,
              search: createSearchParams({
                ...queryConfig,
                order: orderBy.desc,
                sortBy: sortBy.createdAt,
                page: '0'
              }).toString()
            }}
          >
            <div
              className={`bg-primary text-primary px-1 md:px-4 py-1.5 me-1 md:me-2 bg-white text-gray-700 ${
                queryConfig?.sortBy === sortBy.createdAt && 'sort-btn-active'
              }`}
            >
              {t('products:latest')}
            </div>
          </Link>
          <Link
            to={{
              pathname: path.products,
              search: createSearchParams({
                ...queryConfig,
                order: orderBy.desc,
                sortBy: sortBy.sold,
                page: '0'
              }).toString()
            }}
          >
            <div
              className={`bg-primary text-primary px-1 md:px-4 py-1.5 me-2 bg-white text-gray-700 ${
                queryConfig?.sortBy === sortBy.sold && 'sort-btn-active'
              }`}
            >
              {t('products:selling')}
            </div>
          </Link>
          <div className='scale-60 md:scale-100'>
            <Dropdown
              menu={{
                items: [
                  {
                    label: t('products:price') + ': ' + t('products:lowToHight'),
                    key: 'products:lowToHight',
                    icon: queryConfig?.sortBy === sortBy.price && queryConfig?.order === orderBy.asc && (
                      <CheckOutlined />
                    ),
                    danger: queryConfig?.sortBy === sortBy.price && queryConfig?.order === orderBy.asc
                  },
                  {
                    label: t('products:price') + ': ' + t('products:hightToLow'),
                    key: 'products:hightToLow',
                    icon: queryConfig?.sortBy === sortBy.price && queryConfig?.order === orderBy.desc && (
                      <CheckOutlined />
                    ),
                    danger: queryConfig?.sortBy === sortBy.price && queryConfig?.order === orderBy.desc
                  }
                ],
                onClick: (e) => {
                  navigate({
                    pathname: path.products,
                    search: createSearchParams({
                      ...queryConfig,
                      sortBy: sortBy.price,
                      page: '0',
                      order: e.key === 'products:lowToHight' ? orderBy.asc : orderBy.desc
                    }).toString()
                  })
                }
              }}
            >
              <Button>
                <Space>
                  {getLabel()}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
        <Tooltip className='block lg:hidden' placement='top' title={t('products:filter')}>
          <div className='cursor-pointer text-lg' onClick={() => setOpen(true)}>
            <FilterOutlined />
          </div>
        </Tooltip>
      </div>
      <Drawer placement='right' onClose={handleClose} open={open}>
        <Aside />
      </Drawer>
    </>
  )
}

export default Sorter
