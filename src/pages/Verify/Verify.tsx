import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons'
import { Button, StepProps, Steps } from 'antd'
import { useCallback, useState } from 'react'

import VerifyEmail from './components/VerifyEmail'
import UpdateInformation from './components/UpdateInformation'
import DoneStep from './components/DoneStep'
import images from '~/assets/images'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SwitchLocale from '~/components/SwitchLocale'
import LoginLink from '~/components/LoginLink'

function Verify() {
  const [verified, setVerified] = useState<boolean>(false)
  const [current, setCurrent] = useState(0)
  const { t } = useTranslation()
  const steps: StepProps[] = [
    {
      title: t('verify:titleVerification'),
      icon: <SolutionOutlined />
    },
    {
      title: t('verify:titleUpdateInfomation'),
      icon: <UserOutlined />
    },
    {
      title: t('verify:titleDone'),
      icon: <SmileOutlined />
    }
  ]

  const next = () => {
    if (verified) {
      if (current) setCurrent((prev) => prev + 1)
    }
  }

  const handleStepSuccess = useCallback(() => {
    setVerified(true)
    setCurrent((prev) => prev + 1)
  }, [])

  return (
    <div
      className='bg-gray-600 w-100 bg-center min-h-screen bg-cover bg-no-repeat bg-blend-multiply bg-opacity-60 '
      style={{ backgroundImage: `url(${images.formBg})` }}
    >
      <div className='px-2 py-10 md:py-6 md:px-24 flex align-middle justify-center h-full ' style={{ width: '100%' }}>
        <div
          className='bg-white rounded-md px-4 py-4  md:px-10 md:pb-12 md:pt-8 relative overflow-hidden dark:bg-gray-800'
          style={{ width: '100%' }}
        >
          <div className='flex'>
            <SwitchLocale className='mb-2' />
          </div>
          <Steps current={current} labelPlacement='horizontal' items={steps} />
          <div className='h-full mt-4 overflow-y-auto'>
            <div className='flex md:flex-row flex-col-reverse'>
              {current === 0 && <VerifyEmail onVerifySucces={handleStepSuccess} />}
              {current === 1 && <UpdateInformation onUpdateSuccess={handleStepSuccess} />}
              {current === 2 && <DoneStep />}
              <div className='flex-1 h-full md:flex  justify-center hidden ps-4'>
                <img className='object-scale-down' style={{ height: '70vh' }} src={images.salebanner} alt='' />
              </div>
            </div>
            <div className='flex justify-between mt-2'>
              <div>
                {current < steps.length - 1 && (
                  <Button type='primary' onClick={() => next()}>
                    {current === 1 ? t('common:skip') : t('common:next')}
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <LoginLink>
                    <Button type='primary'>{t('common:done')}</Button>
                  </LoginLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verify
