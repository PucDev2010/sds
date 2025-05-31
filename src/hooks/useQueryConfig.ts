import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'
import { QueryParams } from '~/types/page.type'
export type QueryConfig = {
  [key in keyof QueryParams]: string
}
export type SortBy = 'createdAt' | 'name' | 'price'
export type SortOrder = 'asc' | 'desc'

export const defaultPaginationProduct = { page: '0', pageSize: '12' }
export const orderBy = {
  asc: 'asc',
  desc: 'desc'
}

export const sortBy = {
  createdAt: 'createdAt',
  sold: 'sold',
  rate: 'rate',
  price: 'maxPrice'
}
export const OrderStatus = {
  processing: 'processing',
  delivering: 'delivering',
  delivered: 'delivered',
  cancelled: 'cancelled'
}
export default function useQueryConfig(pageSize?: number) {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || defaultPaginationProduct.page,
      pageSize: queryParams.pageSize || pageSize ? pageSize : defaultPaginationProduct.pageSize,
      sortBy: queryParams.sortBy,
      isDeleted: queryParams.isDeleted,
      order: queryParams.order,
      maxPrice: queryParams.maxPrice,
      minPrice: queryParams.minPrice,
      keyWord: queryParams.keyWord,
      categories: queryParams.categories,
      brands: queryParams.brands,
      sku: queryParams.sku,
      sale: queryParams.sale,
      rate: queryParams.rate,
      orderStatus: queryParams.orderStatus
    },
    isUndefined
  )
  return queryConfig
}
