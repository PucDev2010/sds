import { Link } from 'react-router-dom'
import { Alert, Button, message, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import Contact from './Contact'
import path from '~/constant/path'
import { useMutation } from '@tanstack/react-query'

const { Paragraph } = Typography
function DoneStep() {
  const { t } = useTranslation()
  const { mutate, isLoading, data } = useMutation({
    mutationFn: () => {
      return new Promise<string>((resole, rejects) => {
        setTimeout(() => {
          resole('Success')
        }, 3000)
      })
    },
    onSuccess: (res) => {
      message.success(res)
    }
  })
  return (
    <div className='flex-1 h-full'>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Alert message={t('verify:doneAlert')} type='success' showIcon />
      </Space>
      <div className='mt-2'>
        <Typography>
          <h3>{t('verify:doneAlert')}</h3>
          <Paragraph>
            {t('verify:doneVisitWebsitePara')} <Link to={path.home}>https://fooshop.com.vn</Link>
          </Paragraph>
          <Paragraph>{t('verify:doneMaybeLikePara')}</Paragraph>
          <Paragraph>
            <ul>
              <li>
                {t('verify:doneSaleupLabel')} <Link to={path.home}>https://fooshop.com.vn/sale</Link>
              </li>
              <li>
                {t('verify:doneMostRatingLabel')}{' '}
                <a href='https://www.facebook.com/ngocduc.k17c1'>https://fooshop.com.vn/rating</a>
              </li>
              <li>
                {t('verify:doneReciveAdsLabel')}{' '}
                <Button onClick={() => mutate()} disabled={isLoading && data} loading={isLoading} type='link'>
                  {t('common:register')}
                </Button>
              </li>
            </ul>
          </Paragraph>
          <Contact />
        </Typography>
      </div>
    </div>
  )
}

export default DoneStep
