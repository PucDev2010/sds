import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createSearchParams, Navigate, useNavigate } from 'react-router-dom'
import authApi from '~/api/auth.api'
import LoadingModal from '~/components/Loading/LoadingModal'
import useQueryParams from '~/hooks/useQueryParams'
import { setAccessTokenToLS, setRefreshTokenToLS } from '~/utils/auth'
import { getRedirectUrlFromLS, setRedirectUrlToLS, showMessageRespone } from '~/utils/utils'
import path from '~/constant/path'
import { AxiosRequestConfig } from 'axios'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { useDispatch } from 'react-redux'
import { setUser } from '~/slices/userSlice'

function OAuth2Redirect() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryParams = useQueryParams()
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const dispatch = useDispatch()
  const [token] = useState(queryParams?.token || '')
  const { isLoading, mutate } = useMutation({
    mutationFn: (config: AxiosRequestConfig<any>) => {
      return authApi.fetchOauth2Info(config)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        const { accessToken, refreshToken, user } = res.data.data
        setAccessTokenToLS(accessToken)
        setRefreshTokenToLS(refreshToken)
        dispatch(setUser({ isAuthenticated: true, profile: user }))
      } else {
        showMessageRespone(res.data)
      }
    }
  })

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = getRedirectUrlFromLS()
      setRedirectUrlToLS('')
      navigate(redirect)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (token) {
      mutate({
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    }
  }, [token])

  if (queryParams?.token) {
    return (
      <>
        <LoadingModal loading={isLoading} />
      </>
    )
  } else {
    return (
      <Navigate
        to={{
          pathname: path.login,
          search: createSearchParams({ error: queryParams?.error || t('message:oauth2LoginError') }).toString()
        }}
      />
    )
  }
}

export default OAuth2Redirect
