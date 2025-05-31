import { useEffect, useState } from 'react'
import { Alert, Button, Form, Input, Space, message as antMessage } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'

import useQueryParams from '~/hooks/useQueryParams'
import path from '~/constant/path'
import authApi from '~/api/auth.api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'

function ResetPassword() {
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSucess] = useState(false)
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const queryParams = useQueryParams()

  useEffect(() => {
    if (!queryParams?.token) {
      setMessage(t('resetPassword:tokenNotFound'))
    }
  }, [queryParams?.token])

  const { isLoading, mutate } = useMutation({
    mutationFn: (body: { password: string }) => {
      const token = queryParams?.token || ''
      return authApi.resetPassword(body, token)
    },
    onSuccess: (res) => {
      const data = res.data
      setIsSucess(data.success)
      setMessage(data.message)
    },
    onError: (err: AxiosError) => {
      antMessage.error(err?.message)
      console.error(err.message)
    }
  })

  const handleSubmit = (values: any) => {
    if (queryParams?.token) {
      mutate({ password: values?.password })
    }
  }

  return (
    <Form layout='vertical' form={form} name='normal_login' initialValues={{ remember: true }} onFinish={handleSubmit}>
      <Form.Item>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Alert message={t('resetPassword:alert')} type='info' showIcon />
        </Space>
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
      <Form.Item
        name='confirmPassword'
        rules={[
          {
            required: true,
            message: t('message:confirmPasswordEmpty')
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(t('message:confirmPasswordInvalid'))
            }
          })
        ]}
      >
        <Input.Password
          size='large'
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder={t('common:confirmPassword')}
        />
      </Form.Item>
      <Form.Item>
        <Button
          disabled={isLoading || !!!queryParams?.token}
          loading={isLoading}
          type='primary'
          htmlType='submit'
          className='login-form-button w-full'
          size='large'
        >
          {t('common:confirm')}
        </Button>
      </Form.Item>
      <div className='mb-2'>
        {message && (
          <Space direction='vertical' style={{ width: '100%' }}>
            <Alert message={message} type={isSuccess ? 'success' : 'error'} showIcon />
          </Space>
        )}
      </div>
      <div className='mb-2 flex justify-between'>
        <Link to={path.register} className='text-blue-600 font-semibold ms-1'>
          {t('common:login')}
        </Link>
        <Link to={path.forgetpassword} className='text-blue-600 font-semibold ms-1'>
          {t('login:forgotPassword')}
        </Link>
      </div>
    </Form>
  )
}

export default ResetPassword
