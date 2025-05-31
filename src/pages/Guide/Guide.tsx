import { Steps } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import images from '~/assets/images'

function Guide() {
  const { t } = useTranslation('shoppingGuide')
  const [current, setCurrent] = useState(0)

  const onChange = (value: number) => {
    setCurrent(value)
  }
  return (
    <div className='layout-padding text-primary'>
      <div className='py-4 pb-12 custom-ant-step bg-primary my-4 px-4 rounded-md shadow-md'>
        <Steps
          current={current}
          onChange={onChange}
          items={[
            {
              title: t('step') + ` 1`,
              description: t('collectVoucher')
            },
            {
              title: t('step') + ` 2`,
              description: t('selectProduct')
            },
            {
              title: t('step') + ` 3`,
              description: t('previewCart')
            },
            {
              title: t('step') + ` 4`,
              description: t('pay')
            }
          ]}
        />
        <div className='mt-4'>
          {current === 0 && (
            <div>
              <img className='rounded-md overflow-hidden' src={images.shopGuideStep1} />
            </div>
          )}
          {current === 1 && (
            <div>
              <div className='my-2 font-semibold'>{t('selectProduct')}</div>
              <img className='rounded-md overflow-hidden' src={images.shopGuideStep21} />
              <div className='my-2 mt-4 font-semibold'>{t('addToCart')}</div>
              <img className='rounded-md overflow-hidden' src={images.shopGuideStep21} />
            </div>
          )}
          {current === 2 && (
            <div>
              <img className='rounded-md overflow-hidden' src={images.shopGuideStep3} />
            </div>
          )}
          {current === 3 && (
            <div>
              <img className='rounded-md overflow-hidden' src={images.shopGuideStep4} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Guide
