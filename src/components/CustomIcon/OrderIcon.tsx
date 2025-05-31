import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

const Svg = () => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      strokeWidth='0'
      viewBox='0 0 24 24'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M7 18v-2h7v2zm0-4v-2h10v2zm-2 8q-.825 0-1.413-.587Q3 20.825 3 20V6q0-.825.587-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22zm0-2h14V10H5v10zM5 8h14V6H5zm0 0V6v2z'></path>
    </svg>
  )
}
function OrderIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={Svg} {...props} />
}

export default OrderIcon
