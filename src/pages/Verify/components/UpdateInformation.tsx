import { Button, DatePicker, Form, Input, Radio, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { UserAddress, UserInformation } from '~/types/user.type'
import { message as antMessage } from 'antd'
import dayjs from 'dayjs'

import UserAddressComponent from '~/components/UserAddressComponent'
import userApi from '~/api/user.api'
import { useTranslation } from 'react-i18next'
import customParttern from '~/constant/pattern'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  gender: string
  birthday: any
}

function UpdateInformation({ onUpdateSuccess }: { onUpdateSuccess: () => void }) {
  const [form] = Form.useForm()
  const [userAddress, setUserAddress] = useState<UserAddress>({ isValid: false })
  const { t } = useTranslation()
  const { isLoading, mutate } = useMutation({
    mutationFn: (body: UserInformation) => {
      return userApi.updateInformation(body)
    },
    onSuccess: (res) => {
      const data = res.data
      if (data.success) {
        antMessage.success(data.message)
        onUpdateSuccess()
      } else {
        antMessage.error(data.message)
      }
    }
  })

  const handleSubmit = (values: FormData) => {
    if (userAddress.isValid) {
      userAddress.name = `${values.firstName.trim()} ${values.lastName.trim()}`
      userAddress.phoneNumber = values.phone
      const { isValid, ...atrr } = userAddress
      userAddress.defaultAddress = true
      mutate({
        ...values,
        birthday: values?.birthday?.format(customParttern.backEndDatePattern),
        gender: values?.gender === 'true',
        userAddress: { ...atrr }
      })
    } else {
      message.error(t('verify:updateInfoAdreesError'))
    }
  }

  const handleAddressChange = useCallback((value: UserAddress) => {
    setUserAddress(value)
  }, [])

  return (
    <div className='flex-1 h-full'>
      <Form form={form} name='update-information' layout='vertical' onFinish={handleSubmit}>
        <div className='flex'>
          <Form.Item
            name='firstName'
            rules={[{ required: true, message: t('common:requiredField') }]}
            required
            label={t('common:firstname')}
            className='flex-1'
          >
            <Input />
          </Form.Item>
          <div className='px-2'></div>
          <Form.Item
            name='lastName'
            rules={[{ required: true, message: t('common:requiredField') }]}
            required
            label={t('common:lastname')}
            className='flex-1'
          >
            <Input />
          </Form.Item>
        </div>
        <div className='flex'>
          <Form.Item
            required
            name='phone'
            rules={[
              { required: true, message: t('common:requiredField') },
              { pattern: customParttern.phone, message: t('message:phoneInvalid') }
            ]}
            label={t('common:phone')}
            className='flex-1'
          >
            <Input />
          </Form.Item>
          <div className='px-2'></div>
          <Form.Item
            required
            name='birthday'
            rules={[{ required: true, message: t('common:requiredField') }]}
            label={t('common:birthday')}
            className='flex-1'
          >
            <DatePicker
              defaultValue={dayjs()}
              format={'YYYY-MM-DD'}
              allowClear={false}
              placeholder='yyyy-MM-dd'
              className='w-full'
            />
          </Form.Item>
        </div>
        <Form.Item
          validateTrigger='onBlur'
          required
          label={t('common:gender')}
          name='gender'
          initialValue={'true'}
          rules={[{ required: true, message: t('common:requiredField') }]}
        >
          <Radio.Group>
            <Radio value='true'>{t('common:male')}</Radio>
            <Radio value='false'>{t('common:female')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('common:address')} required>
          <UserAddressComponent onAddressChange={handleAddressChange} itemClassName='flex-1 mx-1' />
        </Form.Item>
        <Button htmlType='submit' type='primary' disabled={isLoading} loading={isLoading}>
          {t('common:submit')}
        </Button>
      </Form>
    </div>
  )
}

export default UpdateInformation
