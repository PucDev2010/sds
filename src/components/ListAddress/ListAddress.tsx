import { Button, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { UserAddress } from '~/types/user.type'
import { useState } from 'react'
import config from '~/constant/config'

type ListAddressProps = {
  onAddAddress?: () => void
  addresses: UserAddress[]
  selectedAddress: UserAddress | undefined
  onConfirm?: (id?: number) => void
  onUpdate?: (id?: number) => void
}

function ListAddress({
  onAddAddress = () => {},
  addresses,
  selectedAddress,
  onConfirm = () => {},
  onUpdate = () => {}
}: ListAddressProps) {
  const { t } = useTranslation()
  const [selectedId, setSeletedId] = useState<number | undefined>(selectedAddress?.id)
  return (
    <div>
      <div className='sticky top-0 text-lg mb-2'>{t('cart:myAddress')}</div>
      <div className='overflow-y-auto pb-2' style={{ maxHeight: '400px' }}>
        {addresses.length > 0 &&
          addresses.map((address) => {
            const { name, phoneNumber, id, detail, defaultAddress, ward, district, province } = address
            return (
              <div style={{ fontSize: '1rem' }} className='flex flex-col md:flex-row py-4 border-t' key={id}>
                <div className='flex flex-1 justify-start items-start'>
                  <div style={{ paddingTop: '2px', paddingRight: '6px' }}>
                    <input type={'radio'} checked={id === selectedId} onChange={() => setSeletedId(id)} />
                  </div>
                  <div className='flex-1'>
                    <div className='font-semibold'>{`${name} - ${phoneNumber}`}</div>
                    {detail && <div className='inline-block me-1'>{detail}, </div>}
                    <div className='my-1'>
                      <span className='inline-block me-1'>{ward},</span>
                      <span className='inline-block me-1'>{district},</span>
                      <span className='inline-block me-1'>{province}</span>
                    </div>
                    <div>
                      {defaultAddress && (
                        <Button danger size='small'>
                          {t('cart:default')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Button onClick={() => onUpdate(id)} type='link'>
                    {t('common:update')}
                  </Button>
                </div>
              </div>
            )
          })}
        <Tooltip title={t('common:maximumAddres')} placement='top'>
          <Button
            disabled={addresses.length === config.maximumAddress}
            icon={<PlusOutlined />}
            onClick={onAddAddress}
            type='default'
          >
            {t('cart:addAddress')}
          </Button>
        </Tooltip>
      </div>
      <div className='flex justify-end py-3 border-t'>
        <Button
          onClick={() => {
            onConfirm(selectedId)
          }}
          type='primary'
        >
          {t('common:confirm')}
        </Button>
      </div>
    </div>
  )
}

export default ListAddress
