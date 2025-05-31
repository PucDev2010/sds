import { Button, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '~/api/auth.api'
import path from '~/constant/path'
import { useTranslation } from 'react-i18next'
import { AxiosError } from 'axios'

type FormData = {
  email: string
  password: string
}

function Register() {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: FormData) => {
      return authApi.register(data)
    },
    onSuccess: (res) => {
      const data = res.data
      if (data.success) {
        navigate(path.verifyInformation)
      } else {
        message.error(data.message)
      }
    },
    onError: (err: AxiosError) => {
      message.error(err?.message)
      console.error(err.message)
    }
  })

  return (
    <Form form={form} name='normal_login' initialValues={{ remember: true }} onFinish={mutate}>
      <Form.Item
        name='email'
        rules={[
          { required: true, message: t('message:emailNotEmpty') },
          { type: 'email', message: t('message:emailInvalid') }
        ]}
      >
        <Input size='large' prefix={<UserOutlined className='site-form-item-icon' />} placeholder={t('common:email')} />
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
        <Button loading={isLoading} type='primary' htmlType='submit' className='login-form-button w-full' size='large'>
          {t('common:register')}
        </Button>
      </Form.Item>
      <div className='mb-2'>
        {t('register:haveAccount')}
        <Link to={path.login} className='text-blue-600 font-semibold ms-1 inline-block'>
          {t('common:login')}
        </Link>
      </div>
    </Form>
  )
}

export default Register
