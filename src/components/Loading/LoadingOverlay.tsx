import { Spin } from 'antd'
type LoadingOverlayProps = {
  loading: boolean
  tip?: string
  className?: string
}
function LoadingOverlay({ loading = false, tip = 'Loading...', className = '' }: LoadingOverlayProps) {
  return loading ? (
    <div
      className={`absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-700/50 ${className}`}
    >
      <Spin tip={tip}></Spin>
    </div>
  ) : (
    <></>
  )
}

export default LoadingOverlay
