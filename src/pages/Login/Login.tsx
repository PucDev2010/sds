import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Button, Form, Input, Checkbox, Alert, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'

import path from '~/constant/path'
import authApi from '~/api/auth.api'
import { getRedirectUrlFromLS, handleError, setRedirectUrlToLS } from '~/utils/utils'
import useQueryParams from '~/hooks/useQueryParams'
import { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '~/slices/userSlice'

type FormData = {
  email: string
  password: string
}

function Login() {
  const [errorMessage, setErrorMessage] = useState('')
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const param = useQueryParams()
  const dispatch = useDispatch()
  useEffect(() => {
    if (param?.redirect) {
      setRedirectUrlToLS(param.redirect)
    }
  }, [param])

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: FormData) => {
      return authApi.login(data)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        const data = res.data.data
        if (!data.user.verified) {
          navigate(path.verifyInformation)
        } else {
          dispatch(setUser({ isAuthenticated: true, profile: data.user }))
        }
      } else {
        setErrorMessage(res.data.message)
      }
    },
    onError: (err: AxiosError) => {
      message.error(err?.message)
      handleError(err)
    }
  })

  return (
    <>
      {errorMessage && <Alert message={errorMessage} type='error' showIcon />}
      <Form form={form} name='normal_login' initialValues={{ remember: true }} onFinish={mutate}>
        <Form.Item
          name='email'
          rules={[
            { required: true, message: t('message:emailNotEmpty') },
            { type: 'email', message: t('message:emailInvalid') }
          ]}
        >
          <Input
            size='large'
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder={t('common:email')}
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            { required: true, message: t('message:passwordNotEmpty') },
            { min: 6, message: t('message:passwordMinLength') }
          ]}
        >
          <Input.Password
            size='large'
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder={t('common:password')}
          />
        </Form.Item>
        <div className='flex justify-between w-full py-2 mb-2'>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>{t('login:remember')}</Checkbox>
          </Form.Item>

          <Link className='text-blue-600 font-semibold' to={path.forgetpassword}>
            {t('login:forgotPassword')}
          </Link>
        </div>

        <Form.Item>
          <Button loading={isLoading} type='primary' htmlType='submit' className='w-full' size='large'>
            {t('common:login')}
          </Button>
        </Form.Item>
        <div className='mb-2'>
          {t('login:notHaveAccount')}
          <Link to={path.register} className='text-blue-600 font-semibold inline-block ms-2'>
            {t('common:register')}
          </Link>
        </div>
        {param?.error && (
          <Form.Item>
            <Alert message={param.error} type='error' showIcon />
          </Form.Item>
        )}
      </Form>
    </>
  )
}

export default Login
