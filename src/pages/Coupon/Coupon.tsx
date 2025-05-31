import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Modal, Row } from 'antd'

import voucherApi from '~/api/voucher.api'
import QueryKey from '~/constant/queryKey'
import { Voucher } from '~/types/voucher.type'
import VoucherItem from '~/components/VoucherItem'
import { showMessageRespone } from '~/utils/utils'
import useFetchUserVoucher from '~/hooks/useFetchUserVoucher'
import LoadingModal from '~/components/Loading/LoadingModal'
import VoucherItemDetail from '~/components/VoucherItemDetail'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import LoginLink from '~/components/LoginLink'

function Coupon() {
  const { t } = useTranslation()
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>()
  const [receivedVouchers, setReceivedVouchers] = useState<Voucher[]>([])
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const receiveVoucherMutation = useMutation({
    mutationFn: () => {
      return voucherApi.recievedVouher(selectedVoucher?.code || '')
    },
    onSuccess: (res) => {
      showMessageRespone(res.data)
      if (res.data.success) {
        setReceivedVouchers((prev) => [...prev, res.data.data])
        queryClient.invalidateQueries([QueryKey.fetchUserVoucher], { refetchType: 'none' })
      }
    }
  })

  const fetchUserVoucher = useFetchUserVoucher({})

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.fetchAvaiableVoucher],
    queryFn: () => {
      return voucherApi.getAvailableVoucher()
    },
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (data) {
      setVouchers(data.data.data)
    }
  }, [data])

  useEffect(() => {
    if (fetchUserVoucher.data) {
      setReceivedVouchers(fetchUserVoucher.data.data.data)
    }
  }, [fetchUserVoucher.data])

  const isReceived = (voucherId: number) => {
    const index = receivedVouchers.findIndex((voucher) => voucher.id === voucherId)
    return index > -1
  }

  const handleClickReceived = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    receiveVoucherMutation.mutate()
  }

  const handleClickShowDetail = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setOpen(true)
  }

  return (
    <div className='layout-padding my-4 text-primary relative'>
      <div className='bg-primary px-4 py-5 rounded-md shadow-sm'>
        <div className='text-xl text-center pb-4 text-blue-600'>{t('coupon:title')}</div>
        <div className='my-4 text-lg text-blue-600'>{t('coupon:freeShipVoucher')}</div>
        <Row gutter={[16, 16]}>
          {vouchers
            .filter((voucher) => voucher.voucherType === 'free_ship')
            .map((voucher) => (
              <Col key={voucher.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <VoucherItem
                  voucher={voucher}
                  footer={
                    <div>
                      {!isReceived(voucher.id) ? (
                        <>
                          {isAuthenticated ? (
                            <Button
                              onClick={() => {
                                handleClickReceived(voucher)
                              }}
                              loading={isLoading && selectedVoucher?.id === voucher.id}
                              disabled={isLoading && selectedVoucher?.id === voucher.id}
                              size='small'
                              type='default'
                              danger
                            >
                              {t('coupon:getVouher')}
                            </Button>
                          ) : (
                            <LoginLink>
                              <Button size='small' type='default' danger>
                                {t('coupon:getVouher')}
                              </Button>
                            </LoginLink>
                          )}
                        </>
                      ) : (
                        <Button disabled size='small'>
                          {t('coupon:received')}
                        </Button>
                      )}
                      <Button onClick={() => handleClickShowDetail(voucher)} size='small' type='link'>
                        Chi tiết
                      </Button>
                    </div>
                  }
                />
              </Col>
            ))}
        </Row>
        <div className='my-4 text-lg text-blue-600'>{t('coupon:discountVoucher')}</div>
        <Row gutter={[16, 16]}>
          {vouchers
            .filter((voucher) => voucher.voucherType !== 'free_ship')
            .map((voucher) => (
              <Col key={voucher.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <VoucherItem
                  voucher={voucher}
                  footer={
                    <div>
                      {!isReceived(voucher.id) ? (
                        <>
                          {isAuthenticated ? (
                            <Button
                              onClick={() => {
                                handleClickReceived(voucher)
                              }}
                              loading={isLoading && selectedVoucher?.id === voucher.id}
                              disabled={isLoading && selectedVoucher?.id === voucher.id}
                              size='small'
                              type='default'
                              danger
                            >
                              {t('coupon:getVouher')}
                            </Button>
                          ) : (
                            <LoginLink>
                              <Button size='small' type='default' danger>
                                {t('coupon:getVouher')}
                              </Button>
                            </LoginLink>
                          )}
                        </>
                      ) : (
                        <Button disabled size='small'>
                          {t('coupon:received')}
                        </Button>
                      )}
                      <Button onClick={() => handleClickShowDetail(voucher)} size='small' type='link'>
                        Chi tiết
                      </Button>
                    </div>
                  }
                />
              </Col>
            ))}
        </Row>
      </div>
      {open && selectedVoucher && (
        <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
          <VoucherItemDetail voucher={selectedVoucher} />
        </Modal>
      )}
      {fetchUserVoucher.isLoading && isAuthenticated && <LoadingModal loading />}
      {isLoading && <LoadingModal loading />}
    </div>
  )
}

export default Coupon
