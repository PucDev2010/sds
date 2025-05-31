import Paragraph from 'antd/es/typography/Paragraph'
import { useTranslation } from 'react-i18next'

function Contact() {
  const { t } = useTranslation()
  return (
    <>
      <Paragraph>{t('verify:verificationContact')}</Paragraph>
      <Paragraph>
        <ul>
          <li>
            {t('common:hotline')} <a href='tel:0123456789'>+84.xxx.xxx</a>
          </li>
          <li>
            {t('common:facebook')}
            <a href='https://www.facebook.com/ngocduc.k17c1'>https://www.facebook.com/ngocduc.k17c1</a>
          </li>
          <li>
            {t('common:email')} <a href='mailto: daungocduc1999@gmail.com'>daungocduc1999@gmail.com</a>
          </li>
        </ul>
      </Paragraph>
    </>
  )
}

export default Contact
