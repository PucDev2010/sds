import { useState } from 'react'
import { Button, Col, Empty, Modal, Row, Spin } from 'antd'
import { sortBy } from 'lodash'
import { useTranslation } from 'react-i18next'

import VoucherItem from '~/components/VoucherItem'
import useFetchUserVoucher from '~/hooks/useFetchUserVoucher'
import { Voucher } from '~/types/voucher.type'
import VoucherItemDetail from '~/components/VoucherItemDetail'

function UserVoucherManage() {
  const { data, isLoading } = useFetchUserVoucher({ isUsed: false })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>()
  const { t } = useTranslation()
  return (
    <div className='bg-primary text-primary px-2 w-full h-full md:px-6 relative py-4 md:py-6'>
      {isLoading ? (
        <div className='w-full h-full flex justify-center items-center'>
          <Spin></Spin>
        </div>
      ) : (
        <div>
          {!!!data ? (
            <Empty />
          ) : (
            <div>
              <Row gutter={[16, 16]}>
                {data.data.data &&
                  sortBy(data.data.data, [(item) => item.voucherType]).map((voucher) => (
                    <Col md={12} xs={24} lg={24} xl={12} key={voucher.id}>
                      <VoucherItem
                        footer={
                          <div>
                            <Button
                              onClick={() => {
                                setIsOpen(true)
                                setSelectedVoucher(voucher)
                              }}
                              type='link'
                              size='small'
                            >
                              {t('orderManage:detail')}
                            </Button>
                          </div>
                        }
                        voucher={voucher}
                      />
                    </Col>
                  ))}
              </Row>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <Modal footer={null} open onCancel={() => setIsOpen(false)}>
          {selectedVoucher && <VoucherItemDetail voucher={selectedVoucher} />}
        </Modal>
      )}
    </div>
  )
}

export default UserVoucherManage
