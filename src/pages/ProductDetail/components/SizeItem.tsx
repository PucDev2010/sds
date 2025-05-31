import { Size } from '~/types/size.type'

function SizeItem({
  size,
  active = false,
  onClick = () => {}
}: {
  size: Size
  active?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex justify-center cursor-pointer px-2 py-1 w-8 h-8 me-2 border rounded-sm ${
        active && 'border-red-600'
      }`}
    >
      <div className='text-primary bg-primary'>{size.name}</div>
    </div>
  )
}
export default SizeItem
