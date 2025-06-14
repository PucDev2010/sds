import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

const Svg = () => {
  return (
    <svg width='2rem' height='2rem' viewBox='0 0 64 64' strokeWidth='3' stroke='currentColor' fill='none'>
      <path d='M21.68,42.22H37.17a1.68,1.68,0,0,0,1.68-1.68L44.7,19.12A1.68,1.68,0,0,0,43,17.44H17.61a1.69,1.69,0,0,0-1.69,1.68l-5,21.42a1.68,1.68,0,0,0,1.68,1.68h2.18' />
      <path d='M41.66,42.22H38.19l5-17.29h8.22a.85.85,0,0,1,.65.3l3.58,6.3a.81.81,0,0,1,.2.53L52.51,42.22h-3.6' />
      <ellipse cx='18.31' cy='43.31' rx='3.71' ry='3.76' />
      <ellipse cx='45.35' cy='43.31' rx='3.71' ry='3.76' />
      <line x1='23.25' y1='22.36' x2='6.87' y2='22.36' strokeLinecap='round' />
      <line x1='20.02' y1='27.6' x2='8.45' y2='27.6' strokeLinecap='round' />
      <line x1='21.19' y1='33.5' x2='3.21' y2='33.5' strokeLinecap='round' />
    </svg>
  )
}
function DeliveringIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={Svg} {...props} />
}

export default DeliveringIcon
