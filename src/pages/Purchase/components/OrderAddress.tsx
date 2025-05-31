import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { UserAddress } from '~/types/user.type'
import ListAddress from '~/components/ListAddress'
import AddressForm from '~/components/AddressForm'
import { find } from 'lodash'
import UserAddressPreview from './UserAddressPreview'

function OrderAddress({
  selectedAddress,
  onChangeAddress = () => {},
  addresses = [],
  onSubmitAddressForm = () => {}
}: {
  selectedAddress?: UserAddress
  onChangeAddress?: (userAddress: UserAddress) => void
  addresses?: UserAddress[]
  onSubmitAddressForm?: (userAddress: UserAddress) => void
}) {
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(1)
  const [editAddress, setEditAddress] = useState<UserAddress | undefined>()

  const handleOpenAddAddressModal = () => {
    setIsModalOpen(true)
    setActiveModal(2)
  }

  const handleClickAddAddress = () => {
    setActiveModal(2)
  }

  const handleSubmitAddressForm = (userAddress: UserAddress) => {
    onSubmitAddressForm(userAddress)
    setActiveModal(1)
  }

  const handleChangeAddress = (id?: number) => {
    if (addresses.length > 0 && selectedAddress && id) {
      const address = find(addresses, { id })
      if (address) {
        onChangeAddress(address)
      }
      setIsModalOpen(false)
    }
  }

  const handleUpdateAddress = (id?: number) => {
    if (addresses.length > 0 && selectedAddress && id) {
      const address = find(addresses, { id })
      if (address) {
        setEditAddress(address)
        setActiveModal(2)
      }
    }
  }

  return (
    <div>
      <div className='my-4 bg-primary'>
        <div className='purchase-address-line'></div>
        <div className='ps-2 md:ps-8 py-4 flex text-lg text-red-500'>
          <EnvironmentOutlined />
          <div className='ms-2'>{t('cart:deliveryAddress')}</div>
        </div>
        <div className='ps-2 md:ps-8 pb-4'>
          {addresses?.length === 0 ? (
            <Button icon={<PlusOutlined />} onClick={handleOpenAddAddressModal} type='link'>
              {t('cart:addAddress')}
            </Button>
          ) : (
            <>
              {selectedAddress && (
                <UserAddressPreview onChangeAddress={() => setIsModalOpen(true)} address={selectedAddress} />
              )}
            </>
          )}
        </div>
      </div>
      {/* User Address Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          footer={null}
          centered
          onCancel={() => {
            setIsModalOpen(false)
            setActiveModal(1)
          }}
        >
          {activeModal === 1 ? (
            <ListAddress
              onConfirm={handleChangeAddress}
              selectedAddress={selectedAddress}
              addresses={addresses}
              onAddAddress={handleClickAddAddress}
              onUpdate={handleUpdateAddress}
            />
          ) : (
            <AddressForm userAddress={editAddress} onSuccess={handleSubmitAddressForm} />
          )}
        </Modal>
      )}
    </div>
  )
}

export default OrderAddress
