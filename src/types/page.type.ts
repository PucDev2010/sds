export interface PageQueryParam {
  page?: number
  pageSize?: number
  order?: string
}
export interface QueryParams extends PageQueryParam {
  isDeleted?: boolean
  categories?: string
  brands?: string
  minPrice?: number
  maxPrice?: number
  keyWord?: string
  sortBy?: string
  sku?: string
  sale?: boolean
  rate?: number
  orderStatus?: string
}
export interface IPagination {
  totalItems: number
  totalPage: number
  currentPage: number
  pageSize: number
}
export interface Page<T> extends IPagination {
  datas: T[]
}
