import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

const Svg = () => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      strokeWidth='0'
      version='1'
      viewBox='0 0 48 48'
      enableBackground='new 0 0 48 48'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle fill='#F44336' cx='24' cy='24' r='21'></circle>
      <polygon
        fill='#FFCA28'
        points='24,11 27.9,18.9 36.6,20.2 30.3,26.3 31.8,35 24,30.9 16.2,35 17.7,26.3 11.4,20.2 20.1,18.9'
      ></polygon>
    </svg>
  )
}
function TopRatingIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={Svg} {...props} />
}

export default TopRatingIcon
