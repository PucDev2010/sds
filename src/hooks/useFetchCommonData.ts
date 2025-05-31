import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import commonApi from '~/api/common.api'
import QueryKey from '~/constant/queryKey'
import { Brand } from '~/types/brand.type'
import { Category } from '~/types/category.type'

function useFetchCommonData(): UseQueryResult<[Category[], Brand[]], AxiosError<unknown, any>> {
  const fetchCommonData = useQuery({
    queryKey: [QueryKey.fetchCommonData],
    staleTime: 30 * 60 * 1000,
    queryFn: () => {
      return commonApi.fetchCommonData()
    },
    retry: 1,
    onError: (err: AxiosError) => {
      console.error(err.message)
    }
  })
  return fetchCommonData
}

export default useFetchCommonData
