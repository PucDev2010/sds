import { useTranslation } from 'react-i18next'
import FaceBook from '~/components/Facebook'
import Google from '~/components/Google'
import { FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from '~/constant/oauth2'
function SocialAuth() {
  const { t } = useTranslation('formLayout')
  return (
    <>
      <div className='text-xl font-semibold leading-tight tracking-tight text-blue-500 dark:text-gray-100'>
        {t('title')}
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
        <a
          href={FACEBOOK_AUTH_URL}
          className='border border-gray-300 px-2 py-3 text-center rounded-md mb-2 relative hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-600'
        >
          <FaceBook className='absolute' width={26} height={26} />
          <span className='text-gray-500 dark:text-gray-100'>{t('facebookTitle')}</span>
        </a>
        <a
          href={GOOGLE_AUTH_URL}
          className='border border-gray-300 px-2 py-3 text-center rounded-md mb-2 relative hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-600'
        >
          <Google className='absolute' width={26} height={26} />
          <span className='text-gray-500 dark:text-gray-100'>{t('googleTitle')}</span>
        </a>
      </div>
      <div className='m-0 flex text-gray-500 items-center'>
        <div className='flex-1 bg-gray-300 dark:bg-gray-500' style={{ height: '2px' }}></div>
        <div className='px-4'>{t('or')}</div>
        <div className='flex-1 bg-gray-300 dark:bg-gray-500' style={{ height: '2px' }}></div>
      </div>
    </>
  )
}

export default SocialAuth
