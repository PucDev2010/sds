import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

const Svg = () => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      strokeWidth='0'
      viewBox='0 0 512 512'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M376.2 224H268l52.4-186.9c.9-4.5-4.6-7.1-7.2-3.4L129.5 274.6c-3.8 5.6-.2 13.4 6.3 13.4H244l-52.4 186.9c-.9 4.5 4.6 7.1 7.2 3.4l183.7-240.8c3.7-5.7.2-13.5-6.3-13.5z'></path>
    </svg>
  )
}
function FlashSaleIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={Svg} {...props} />
}

export default FlashSaleIcon
