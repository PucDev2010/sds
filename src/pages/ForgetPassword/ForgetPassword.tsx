import { useState } from 'react'
import { Alert, Button, Form, Input, Space, message as antMessage } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'

import authApi from '~/api/auth.api'
import path from '~/constant/path'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'

function ForgetPassword() {
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { isLoading, mutate } = useMutation({
    mutationFn: (body: { email: string }) => {
      return authApi.forgetPassword(body)
    },
    onSuccess: (res) => {
      const data = res.data
      setMessage(data.message)
      setIsSuccess(data.success)
    },
    onError: (err: AxiosError) => {
      antMessage.error(err?.message)
      console.error(err.message)
    }
  })

  return (
    <Form layout='vertical' form={form} name='normal_login' initialValues={{ remember: true }} onFinish={mutate}>
      <Form.Item>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Alert message={t('forgetPassword:title')} type='info' showIcon />
        </Space>
      </Form.Item>
      <Form.Item name='email' rules={[{ required: true, type: 'email', message: 'The input is not valid E-mail!' }]}>
        <Input size='large' prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Email' />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} type='primary' htmlType='submit' className='login-form-button w-full' size='large'>
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
      <div className='mb-2'>
        {t('forgetPassword:backTo')}
        <Link to={path.login} className='text-blue-600 font-semibold ms-1'>
          {t('common:login')}
        </Link>
      </div>
    </Form>
  )
}

export default ForgetPassword
