import { Modal, Spin } from 'antd'

type LoadingModalProps = {
  loading: boolean
  tip?: string
}

function LoadingModal({ loading = false, tip = 'Loading...' }: LoadingModalProps) {
  return (
    <Modal open={loading} footer={null} closable={false} className='flex justify-center'>
      <Spin tip={tip}></Spin>
    </Modal>
  )
}

export default LoadingModal
