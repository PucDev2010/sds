import { Outlet } from 'react-router-dom'
import images from '~/assets/images'
import Logo from '~/components/Logo'
import SocialAuth from '~/components/SocialAuth'
import SwitchLocale from '~/components/SwitchLocale'

export type LayoutProps = {
  children?: React.ReactNode
  socialOption?: boolean
}

function FormLayout({ socialOption }: LayoutProps) {
  return (
    <div
      className='bg-gray-600 h-screen w-100 bg-center bg-cover bg-no-repeat bg-blend-multiply bg-opacity-60 text-primary'
      style={{ backgroundImage: `url(${images.formBg})` }}
    >
      <section>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 '>
          <div className='w-full rounded-lg shadow md:mt-0 sm:max-w-md md:max-w-xl xl:p-0 bg-primary dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <div className='flex justify-between items-center'>
                <Logo />
                <SwitchLocale />
              </div>
              {socialOption && <SocialAuth />}
              <Outlet />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FormLayout
