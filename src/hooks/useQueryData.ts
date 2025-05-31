import { QueryFilters, QueryKey, useQueryClient } from '@tanstack/react-query'

type QueryProps = {
  queryKey: QueryKey
  filters?: QueryFilters
}

function useQueryData<T>({ queryKey, filters }: QueryProps) {
  const queryClient = useQueryClient()
  return queryClient.getQueryData<T>(queryKey, filters)
}
export default useQueryData
