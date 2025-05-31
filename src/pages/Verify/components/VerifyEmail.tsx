import { LoadingOutlined } from '@ant-design/icons'
import { Button, Alert, Space, Statistic, Input, Typography, message } from 'antd'
import { memo, useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import authApi from '~/api/auth.api'
import { message as antMessage } from 'antd'
import { useTranslation } from 'react-i18next'
import Contact from './Contact'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { useDispatch } from 'react-redux'
import { setProfile, setUser } from '~/slices/userSlice'

const { Countdown } = Statistic
const { Paragraph } = Typography
function VerifyEmail({ onVerifySucces = () => {} }) {
  const { profile } = useSelector((root: RootState) => root.user)
  const dispatch = useDispatch()
  const [isResending, setIsResending] = useState<boolean>(false)
  const [code, setCode] = useState('')
  const [deadline, setDeadline] = useState<number>(0)
  const { t } = useTranslation()

  const resendCodeMutation = useMutation({
    mutationFn: () => {
      return authApi.resendVerifyCode()
    },
    onSuccess: (res) => {
      const data = res.data
      if (data.success) {
        antMessage.success(data.message)
      } else {
        antMessage.error(data.message)
      }
    }
  })

  const verifyMutation = useMutation({
    mutationFn: (body: { verifyCode: string }) => {
      return authApi.verifyEmail(body)
    },
    onSuccess: (res) => {
      const data = res.data
      if (data.success) {
        if (profile) {
          dispatch(setUser({ profile: { ...profile, verified: true }, isAuthenticated: true }))
        }
        onVerifySucces()
      } else {
        antMessage.error(data.message)
      }
    }
  })
  const onFinish = useCallback(() => {
    setIsResending(false)
  }, [])

  const handleResend = () => {
    resendCodeMutation.mutate()
    const timeout = Date.now() + 60 * 1000
    setDeadline(timeout)
    setIsResending(true)
    setTimeout(() => {
      setIsResending(false)
    }, 60 * 1000)
  }

  const handleVerify = () => {
    if (code && code.length === 4) {
      verifyMutation.mutate({ verifyCode: code })
    } else {
      message.error(t('verify:codeError'))
    }
  }

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
  }

  return (
    <div className='flex-1 h-full'>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Alert
          message={t('verify:alert')}
          type='info'
          showIcon
          action={
            <Button disabled={isResending} onClick={handleResend} size='small' type='default'>
              <div className='flex align-middle'>
                <div className='px-2'>{t('verify:resendCode')}</div>
                {isResending && (
                  <Countdown valueStyle={{ fontSize: '0.8rem' }} value={deadline} onFinish={onFinish} format='mm:ss' />
                )}
              </div>
            </Button>
          }
        />
      </Space>
      <div className='my-4'>
        <Space.Compact style={{ width: '100%' }}>
          <Input value={code} onChange={handleChangeCode} placeholder={t('verify:verifyCode')} />
          <Button disabled={verifyMutation.isLoading} onClick={handleVerify} type='primary'>
            <div className='flex align-middle'>
              {verifyMutation.isLoading && <LoadingOutlined style={{ fontSize: 20 }} spin className='me-2' />}
              {t('common:submit')}
            </div>
          </Button>
        </Space.Compact>
      </div>
      <Typography>
        <h3>{t('verify:greeting')}</h3>
        <Paragraph>{t('verify:verificationDescription')}</Paragraph>
        <Contact />
      </Typography>
    </div>
  )
}

export default memo(VerifyEmail)
