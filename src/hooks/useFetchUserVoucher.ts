import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useSelector } from 'react-redux'
import voucherApi from '~/api/voucher.api'
import QueryKey from '~/constant/queryKey'
import { RootState } from '~/store/store'
import { SuccessResponse } from '~/types/utils.type'
import { Voucher } from '~/types/voucher.type'

function useFetchUserVoucher(params: {
  isUsed?: boolean
}): UseQueryResult<AxiosResponse<SuccessResponse<Voucher[]>, any>, AxiosError<unknown, any>> {
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const fetchUserVoucher = useQuery({
    queryKey: [QueryKey.fetchUserVoucher],
    staleTime: 5 * 60 * 1000,
    queryFn: () => {
      return voucherApi.getVoucherByUser(params)
    },
    retry: 1,
    onError: (err: AxiosError) => {
      console.error(err.message)
    },
    enabled: isAuthenticated
  })
  return fetchUserVoucher
}

export default useFetchUserVoucher
