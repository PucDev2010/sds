import { Button, Col, DatePicker, Form, Input, Radio, Row, message as antMessage } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

import userApi from '~/api/user.api'
import { User } from '~/types/user.type'
import QueryKey from '~/constant/queryKey'
import LoadingOverlay from '~/components/Loading/LoadingOverlay'
import AvatarUpload from './components/AvatarUpload'
import { RootState } from '~/store/store'
import { setProfile } from '~/slices/userSlice'
import customParttern from '~/constant/pattern'
import { isUndefined, omitBy } from 'lodash'
type FormData = {
  firstName: string
  lastName: string
  phone: string
  gender: string
  birthday: any
}
function Me() {
  const { profile } = useSelector((root: RootState) => root.user)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const fetchUser = useQuery({
    queryKey: [QueryKey.fetchUser],
    queryFn: () => {
      return userApi.fetchProfile()
    },
    onSuccess: (res) => {
      if (res.data.success) {
        const data = res.data.data
        dispatch(setProfile(data))
      }
    },
    staleTime: 30 * 60 * 1000
  })

  useEffect(() => {
    if (fetchUser.data) {
      form.setFieldsValue(
        omitBy(
          {
            ...profile,
            birthday: profile?.birthday ? dayjs(profile?.birthday, customParttern.date) : undefined,
            gender: profile?.gender?.toString()
          },
          isUndefined
        )
      )
    }
  }, [fetchUser.data])

  const { isLoading, mutate } = useMutation({
    mutationFn: (body: User) => {
      return userApi.updateInformation(body)
    },
    onSuccess: (res, formData) => {
      const data = res.data
      if (data.success) {
        antMessage.success(data.message)
        setProfile({ ...profile, ...formData })
        queryClient.invalidateQueries({ queryKey: [QueryKey.fetchUser] })
      } else {
        antMessage.error(data.message)
      }
    }
  })

  const handleSubmit = (values: FormData) => {
    const { birthday, gender, ...other } = values
    let birthdayFormatted = birthday?.format(customParttern.backEndDatePattern)
    mutate({ ...other, gender: gender === 'true', birthday: birthdayFormatted })
  }
  return (
    <div className='bg-primary px-2 w-full h-full md:px-6 relative py-4 md:py-6'>
      <h2 className='text-xl text-primary font-semibold pb-4 md:pb-6 border-b'>{t('me:personalInformation')}</h2>
      <Row className='mt-4'>
        <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }}>
          <Form form={form} name='update-persional-information' layout='vertical' onFinish={handleSubmit}>
            <Form.Item label='Email'>
              <Input disabled value={profile?.email} />
            </Form.Item>
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
                initialValue={dayjs()}
              >
                <DatePicker
                  format={customParttern.date}
                  allowClear={false}
                  placeholder={customParttern.date}
                  className='w-full'
                  placement='bottomLeft'
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
            <Button htmlType='submit' type='primary' disabled={isLoading} loading={isLoading}>
              {t('common:submit')}
            </Button>
          </Form>
        </Col>
        <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 8 }}>
          <AvatarUpload />
        </Col>
      </Row>
      <LoadingOverlay loading={fetchUser.isLoading} />
    </div>
  )
}

export default Me
