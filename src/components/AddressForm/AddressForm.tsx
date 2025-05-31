import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, Form, Input } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addressApi from '~/api/address.api'
import QueryKey from '~/constant/queryKey'
import { UserAddress, Address } from '~/types/user.type'
import { showMessageRespone } from '~/utils/utils'
import UserAddressComponent from '../UserAddressComponent'

type AddressFormProps = {
  userAddress?: UserAddress
  onSuccess?: (userAddress: UserAddress) => void
}

function AddressForm({ userAddress, onSuccess = () => {} }: AddressFormProps) {
  const queryClient = useQueryClient()
  const [address, setAddress] = useState<Address | undefined>(userAddress)
  const [errorMessage, setErrorMessage] = useState('')
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: UserAddress) => {
      return addressApi.save(body)
    },
    onSuccess: (res) => {
      showMessageRespone(res.data)
      onSuccess(res.data.data)
      queryClient.invalidateQueries({ queryKey: [QueryKey.fetchAddress] })
    },
    onError: (err: AxiosError) => {
      console.error('Save address error:' + err.message)
    }
  })

  useEffect(() => {
    if (userAddress?.id) {
      form.setFieldsValue({
        name: userAddress?.name,
        phoneNumber: userAddress?.phoneNumber,
        detail: userAddress?.detail,
        defaultAddress: userAddress?.defaultAddress
      })
    }
    setAddress(userAddress)
  }, [userAddress])

  const hanldeAddressChange = (value: Address) => {
    setAddress(value)
  }

  const handleSubmitForm = (values: any) => {
    if (!address?.isValid) {
      setErrorMessage(t('message:addressInValid'))
    } else {
      setErrorMessage('')
      if (!values?.defaultAddress) {
        values.defaultAddress = false
      }
      mutate({ ...values, ...address })
    }
  }
  return (
    <div className='pt-6'>
      <div className='text-lg text-blue-500'>
        {userAddress?.id ? t('common:updateAddress') : t('common:createAddress')}:
      </div>
      <Form form={form} layout='vertical' onFinish={handleSubmitForm}>
        <FormItem
          label={t('common:fullname')}
          name='name'
          rules={[{ required: true, message: t('common:requiredField') }]}
          required
          className='flex-1'
        >
          <Input />
        </FormItem>
        <FormItem
          required
          name='phoneNumber'
          rules={[
            { required: true, message: t('common:requiredField') },
            { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: t('message:phoneInvalid') }
          ]}
          label={t('common:phone')}
        >
          <Input />
        </FormItem>
        <FormItem label={t('common:address')}>
          <UserAddressComponent
            className='flex-col'
            itemClassName='my-2 flex-1'
            address={userAddress}
            onAddressChange={hanldeAddressChange}
          />
        </FormItem>
        <FormItem name='detail' label={t('common:note')}>
          <Input />
        </FormItem>
        <FormItem valuePropName='checked' name='defaultAddress'>
          <Checkbox disabled={userAddress?.defaultAddress} defaultChecked={false}>
            {t('common:defaultAddress')}
          </Checkbox>
        </FormItem>
        <FormItem>
          <div className='flex items-center'>
            <Button disabled={isLoading} loading={isLoading} type='primary' htmlType='submit'>
              {t('common:save')}
            </Button>
            {errorMessage && <div className='text-red-500 ms-2'>{errorMessage}</div>}
          </div>
        </FormItem>
      </Form>
    </div>
  )
}

export default AddressForm
