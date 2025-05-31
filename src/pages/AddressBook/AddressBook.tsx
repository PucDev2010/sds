import { Button, Modal, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { UserAddress } from '~/types/user.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import QueryKey from '~/constant/queryKey'
import userApi from '~/api/user.api'
import { AxiosError } from 'axios'
import AddressForm from '~/components/AddressForm'
import config from '~/constant/config'
import LoadingModal from '~/components/Loading/LoadingModal'
import addressApi from '~/api/address.api'
import { handleError, showMessageRespone } from '~/utils/utils'

function AddressBook() {
  const { t } = useTranslation()
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | undefined>()
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const fetchAllAddress = useQuery({
    queryKey: [QueryKey.fetchAddress],
    queryFn: () => {
      return userApi.fetchAllAddress()
    },
    staleTime: 10 * 60 * 1000,
    onError: (err: AxiosError) => {
      console.error('Fetch user address error:' + err.message)
    }
  })

  useEffect(() => {
    if (fetchAllAddress.data) {
      setAddresses(fetchAllAddress.data.data.data.sort((a, b) => Number(b.defaultAddress) - Number(a.defaultAddress)))
    }
  }, [fetchAllAddress.data])

  const deleteAddressMutation = useMutation({
    mutationFn: () => {
      return addressApi.delete(selectedAddress?.id as number)
    },
    onSuccess: (res) => {
      showMessageRespone(res.data)
      setSelectedAddress(undefined)
      setIsOpenDeleteModal(false)
      queryClient.invalidateQueries({ queryKey: [QueryKey.fetchAddress] })
    },
    onError: (err) => {
      handleError(err)
    }
  })

  const handleSetDefault = useMutation({
    mutationFn: (id: number) => {
      return addressApi.setDefault(id)
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.fetchAddress] })
    },
    onError: (err) => {
      handleError(err)
    }
  })

  const handleUpdateAddress = (id: number) => {
    setSelectedAddress(addresses.find((address) => address.id === id))
    setIsModalOpen(true)
  }
  const handleDeleteAdress = (id: number) => {
    setSelectedAddress(addresses.find((address) => address.id === id))
    setIsOpenDeleteModal(true)
  }

  const handleSuccess = (userAddress: UserAddress) => {
    if (selectedAddress) {
      setSelectedAddress(undefined)
      setIsModalOpen(false)
    }
  }

  return (
    <div className='bg-primary text-primary w-full h-full rounded-md'>
      <div className='py-2 px-2 md:px-4 md:py-4 border-b flex justify-between'>
        <div className='text-xl'>{t('addressBook:myAddress')}</div>
        <Tooltip title={t('common:maximumAddres')}>
          <Button
            disabled={addresses.length === config.maximumAddress}
            onClick={() => setIsModalOpen(true)}
            icon={<PlusOutlined />}
            danger
            type='primary'
          >
            {t('addressBook:addAddress')}
          </Button>
        </Tooltip>
      </div>
      <div className='px-2 py-4 md:px-6'>
        {addresses.map((address) => {
          const { defaultAddress, id, province, district, ward, phoneNumber, name, detail } = address
          return (
            <div className='py-2 md:py-6 border-b flex flex-col md:flex-row' key={id}>
              <div className='flex-1'>
                <div className='flex'>
                  <div className='text-base'>{name}</div>
                  <div className='mx-4 border-l-2'></div>
                  <div className='my-1'>{phoneNumber}</div>
                </div>
                <div className='my-1'>{detail}</div>
                <div className='my-1'>
                  <span className='inline-block me-1'>{ward},</span>
                  <span className='inline-block me-1'>{district},</span>
                  <span className='inline-block me-1'>{province}</span>
                </div>
                {defaultAddress && (
                  <Button className='my-1' danger size='small'>
                    {t('addressBook:default')}
                  </Button>
                )}
              </div>
              <div>
                <div className='flex'>
                  <Button onClick={() => handleUpdateAddress(id as number)} className='p-0' type='link'>
                    {t('common:update')}
                  </Button>
                  {!defaultAddress && (
                    <Button onClick={() => handleDeleteAdress(id as number)} className='p-0' type='link' danger>
                      {t('cart:delete')}
                    </Button>
                  )}
                </div>
                {!defaultAddress && (
                  <Button
                    onClick={() => {
                      handleSetDefault.mutate(id as number)
                    }}
                    disabled={handleSetDefault.isLoading}
                    loading={handleSetDefault.isLoading}
                    size='small'
                  >
                    {t('addressBook:setDefault')}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Add or update Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          footer={null}
          centered
          onCancel={() => {
            setIsModalOpen(false)
          }}
        >
          <AddressForm onSuccess={handleSuccess} userAddress={selectedAddress} />
        </Modal>
      )}
      {/* Delete Modal */}
      <Modal
        open={isOpenDeleteModal}
        footer={null}
        centered
        title={t('common:confirm')}
        onCancel={() => {
          setIsOpenDeleteModal(false)
        }}
      >
        <div className='my-2'>{t('addressBook:deleteAddress')}</div>
        <div className='flex'>
          <div className='text-base'>{selectedAddress?.name}</div>
          <div className='mx-4 border-l-2'></div>
          <div className='my-1'>{selectedAddress?.phoneNumber}</div>
        </div>
        <div className='my-1'>{selectedAddress?.detail}</div>
        <div className='my-1'>
          <span className='inline-block me-1'>{selectedAddress?.ward},</span>
          <span className='inline-block me-1'>{selectedAddress?.district},</span>
          <span className='inline-block me-1'>{selectedAddress?.province}</span>
        </div>
        <div className='mt-4 flex justify-end'>
          <Button className='me-2' onClick={() => setIsOpenDeleteModal(false)}>
            {t('common:cancel')}
          </Button>
          <Button
            onClick={() => {
              deleteAddressMutation.mutate()
            }}
            loading={deleteAddressMutation.isLoading}
            disabled={deleteAddressMutation.isLoading}
            danger
            type='primary'
          >
            {t('common:confirm')}
          </Button>
        </div>
      </Modal>
      <LoadingModal loading={fetchAllAddress.isLoading} />
    </div>
  )
}

export default AddressBook
