import { Dropdown } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import config from '~/constant/config'
import { setLocaleToLS } from '~/utils/utils'
import images from '~/assets/images'

const VILabel = () => {
  return (
    <div className='flex items-center justify-between w-10'>
      <span>VI</span>
      <img style={{ width: '16px' }} src={images.viFlag} alt='flag' />
    </div>
  )
}
const UKLabel = () => {
  return (
    <div className='flex items-center justify-between w-10'>
      <span>EN</span>
      <img style={{ width: '16px' }} src={images.ukFlag} alt='flag' />
    </div>
  )
}

function SwitchLocale({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation('common')
  const items: MenuProps['items'] = [
    {
      key: config.viLocale,
      label: <VILabel />
    },
    {
      key: config.enLocale,
      label: <UKLabel />
    }
  ]
  const handleSwitchLocale = (e: any) => {
    if (e?.key !== i18n.language) {
      setLocaleToLS(e.key)
      i18n.changeLanguage(e.key)
    }
  }
  return (
    <div className={className}>
      <Dropdown.Button
        icon={<GlobalOutlined />}
        trigger={['click']}
        placement='bottom'
        menu={{ items, onClick: handleSwitchLocale }}
      >
        {i18n.language === config.viLocale ? <VILabel /> : <UKLabel />}
      </Dropdown.Button>
    </div>
  )
}

export default SwitchLocale
