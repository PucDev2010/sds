import { Button, Form, Input, Modal, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { LockOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import userApi from '~/api/user.api'
import { handleError, showMessageRespone } from '~/utils/utils'
import { useDispatch } from 'react-redux'
import { logout } from '~/slices/userSlice'
import { useEffect, useState } from 'react'
import useLogout from '~/hooks/useLogout'

const { Countdown } = Statistic

type FormData = {
  oldPassword: string
  password: string
  confirmPassword: string
}
const logoutTime = 5000

function ChangePassword() {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const { doLogout } = useLogout()
  const { mutate, isLoading } = useMutation({
    mutationFn: (values: FormData) => {
      const { oldPassword, password } = values
      return userApi.changePassword({ oldPassword, password })
    },
    onSuccess: (res) => {
      if (res.data.success) {
        form.resetFields()
        setOpenModal(true)
        setTimeout(() => {
          doLogout()
        }, logoutTime)
      } else {
        showMessageRespone(res.data)
      }
    },
    onError: (err) => {
      handleError(err)
    }
  })

  const handleSubmit = (values: FormData) => {
    mutate(values)
  }

  return (
    <div className='bg-primary text-primary px-2 w-full h-full md:px-6 relative py-4 md:py-6'>
      <div className='text-xl pb-2 md:pb-4 border-b'>{t('changePassword:changePassword')}</div>
      <div className='flex justify-center mt-2 md:mt-4'>
        <Form onFinish={handleSubmit} layout='vertical' className='w-full md:w-1/2' form={form} name='normal_login'>
          <Form.Item
            name='oldPassword'
            label={t('changePassword:oldPassword')}
            rules={[
              { required: true, message: t('message:passwordNotEmpty') },
              { min: 6, message: t('message:passwordMinLength') }
            ]}
          >
            <Input.Password size='large' prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
          </Form.Item>
          <Form.Item
            name='password'
            label={t('changePassword:newPassword')}
            rules={[
              { required: true, message: t('message:passwordNotEmpty') },
              { min: 6, message: t('message:passwordMinLength') }
            ]}
          >
            <Input.Password size='large' prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            label={t('changePassword:confirmNewPassword')}
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
            <Input.Password size='large' prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={isLoading}
              loading={isLoading}
              type='primary'
              danger
              htmlType='submit'
              className='login-form-button w-full'
              size='large'
            >
              {t('common:confirm')}
            </Button>
          </Form.Item>
        </Form>
      </div>
      {openModal && (
        <Modal open={openModal} footer={null} title={t('common:notification')}>
          <div className='items-center'>
            <div>{t('changePassword:changePasswordSuccess')}</div>
            <div className='flex items-center justify-center'>
              <Countdown suffix='s' value={Date.now() + logoutTime} format='s ' />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ChangePassword
