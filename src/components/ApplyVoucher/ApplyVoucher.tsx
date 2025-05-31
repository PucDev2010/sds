import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Input, Modal, Radio, Space, Spin } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import voucherApi from '~/api/voucher.api'
import { Voucher } from '~/types/voucher.type'
import useFetchUserVoucher from '~/hooks/useFetchUserVoucher'
import { sortBy } from 'lodash'
import VoucherItem from '~/components/VoucherItem'
import classNames from 'classnames'
import { canApplyVoucher } from '~/utils/voucher.utils'
import VoucherItemDetail from '~/components/VoucherItemDetail'
import QueryKey from '~/constant/queryKey'
import { PaymentMethod } from '~/types/PaymentMethod.type'

function ApplyVoucher({
  selectedProductIds,
  total,
  selectedVoucher,
  onSelectedVoucher = () => {},
  paymentMethod
}: {
  selectedProductIds: number[]
  total: number
  selectedVoucher?: Voucher
  onSelectedVoucher?: (voucher: Voucher) => void
  paymentMethod?: PaymentMethod
}) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenPreview, setIsOpenPreview] = useState(false)
  const [code, setCode] = useState('')
  const [previewVoucher, setPreviewVoucher] = useState<Voucher>()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [preSelectVoucher, setPreSelectVoucher] = useState<Voucher>()
  const { data, isLoading } = useFetchUserVoucher({ isUsed: false })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (data) {
      setVouchers(
        sortBy(
          data.data.data.map((voucher) => {
            return {
              ...voucher,
              avaiable: canApplyVoucher(voucher, total, selectedProductIds, paymentMethod)
            }
          }),
          [(item) => !item.avaiable, (item) => item.voucherType]
        )
      )
    }
  }, [data, total, paymentMethod])
  useEffect(() => {
    if (code) {
      setCode('')
    }
  }, [isOpen])

  const checkVoucherMutation = useMutation({
    mutationFn: () => {
      return voucherApi.checkVoucher(code)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        queryClient.invalidateQueries([QueryKey.fetchUserVoucher], { refetchType: 'none' })
        setVouchers((prev) => [
          ...prev,
          {
            ...res.data.data,
            avaiable: canApplyVoucher(res.data.data, total, selectedProductIds, paymentMethod)
          }
        ])
      } else {
        setErrorMessage(res.data.message)
      }
    }
  })
  const handleCheckVoucher = () => {
    if (code.trim()) {
      if (errorMessage) {
        setErrorMessage('')
      }
      checkVoucherMutation.mutate()
    } else {
      setErrorMessage(t('message:voucherEmpty'))
    }
  }

  const handleSelectVoucher = () => {
    if (isOpenPreview && previewVoucher) {
      onSelectedVoucher(previewVoucher)
      setIsOpenPreview(false)
    } else if (preSelectVoucher?.id !== selectedVoucher?.id && preSelectVoucher) {
      onSelectedVoucher(preSelectVoucher)
    }
    setIsOpen(false)
  }
  const handlePreviewVoucher = (voucher: Voucher) => {
    setPreviewVoucher(voucher)
    setIsOpenPreview(true)
  }

  const ApplyVoucherItem = ({ voucher, selected = false }: { voucher: Voucher; selected?: boolean }) => {
    return (
      <VoucherItem footer={null} className='my-3 pe-2 overflow-hidden' voucher={voucher} key={voucher.id}>
        <div
          className={classNames(
            'absolute top-0 left-0 right-2 rounded-sm bottom-0 flex flex-col items-end justify-between',
            { 'bg-gray-100/50': !voucher?.avaiable }
          )}
        >
          {selected ? (
            <div className='pe-2 text-2xl mt-2 text-orange-600'>
              <CheckCircleOutlined />
            </div>
          ) : (
            <div></div>
          )}
          {!selected && (
            <div className='pe-2'>
              <Radio
                onChange={() => setPreSelectVoucher(voucher)}
                disabled={!voucher?.avaiable}
                checked={preSelectVoucher ? preSelectVoucher.id === voucher.id : selectedVoucher?.id === voucher.id}
              ></Radio>
            </div>
          )}
          <div>
            <Button onClick={() => handlePreviewVoucher(voucher)} type='link'>
              {t('mainLayout:showDetails')}
            </Button>
          </div>
        </div>
      </VoucherItem>
    )
  }

  return (
    <div>
      <div className='flex flex-col items-end'>
        <Button onClick={() => setIsOpen(true)} type='link'>
          {t('cart:selectOrEnterCode')}
        </Button>
      </div>
      {isOpen && (
        <Modal
          title={t('cart:selectOrEnterCode')}
          footer={
            <div>
              <Button onClick={() => setIsOpen(false)}>{t('common:cancel')}</Button>
              <Button onClick={handleSelectVoucher} danger type='primary'>
                {t('common:apply')}
              </Button>
            </div>
          }
          open={isOpen}
          onCancel={() => setIsOpen(false)}
        >
          {selectedProductIds.length === 0 ? (
            <Alert description={t('message:selectAtLeastProduct')} type='info' showIcon />
          ) : (
            <div className='mt-8 overflow-y-scroll h-96'>
              <div>
                <Space.Compact style={{ width: '100%', marginBottom: 10 }}>
                  <Input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                    }}
                    placeholder={t('cart:enterVoucher')}
                  />
                  <Button
                    loading={checkVoucherMutation.isLoading}
                    disabled={checkVoucherMutation.isLoading}
                    onClick={handleCheckVoucher}
                    type='default'
                  >
                    {t('cart:apply')}
                  </Button>
                </Space.Compact>
                {checkVoucherMutation.isLoading ? (
                  <div className='flex justify-center'>
                    <Spin></Spin>
                  </div>
                ) : (
                  <>{errorMessage && <Alert message={errorMessage} type='error' showIcon />}</>
                )}
              </div>
              {selectedVoucher && (
                <div>
                  <div className='my-2 text-blue-600'>{t('cart:using')}</div>
                  <ApplyVoucherItem voucher={selectedVoucher} selected />
                  <div className='border-b my-2'></div>
                </div>
              )}
              {isLoading ? (
                <div className='flex justify-center'>
                  <Spin />
                </div>
              ) : (
                vouchers.map((voucher) => {
                  return <ApplyVoucherItem key={voucher.id} voucher={voucher} />
                })
              )}
            </div>
          )}
        </Modal>
      )}
      {/* Preview modal */}
      {isOpenPreview && (
        <Modal footer={null} open onCancel={() => setIsOpenPreview(false)}>
          {previewVoucher && (
            <VoucherItemDetail
              voucher={previewVoucher}
              footer={
                <Button
                  disabled={!previewVoucher.avaiable}
                  onClick={handleSelectVoucher}
                  className='w-full mt-2'
                  danger
                  type='primary'
                >
                  {t('common:apply')}
                </Button>
              }
            />
          )}
        </Modal>
      )}
    </div>
  )
}

export default ApplyVoucher
