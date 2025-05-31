import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { UserAddress } from '~/types/user.type'

function UserAddressPreview({
  address,
  onChangeAddress = () => {}
}: {
  address: UserAddress
  onChangeAddress?: () => void
}) {
  const { t } = useTranslation()
  const { name, phoneNumber, district, ward, province, detail, defaultAddress } = address
  return (
    <div className='text-primary flex flex-wrap items-center text-base'>
      <div className='flex me-4 mb-1 font-semibold'>
        <span className='inline-block me-2'>{name}</span>
        <span>{phoneNumber}</span>
      </div>
      <div className='flex flex-wrap me-10 mb-1'>
        {detail && <span className='inline-block me-1'>{detail}, </span>}
        <span className='inline-block me-1'>{ward},</span>
        <span className='inline-block me-1'>{district},</span>
        <span className='inline-block me-1'>{province}</span>
        {defaultAddress && (
          <Button danger size='small'>
            {t('cart:default')}
          </Button>
        )}
      </div>
      <div onClick={onChangeAddress} className='mb-1'>
        <Button size='small' type='link'>
          {t('cart:change')}
        </Button>
      </div>
    </div>
  )
}

export default UserAddressPreview
