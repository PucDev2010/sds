import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { ProductAttribute } from '~/types/product.attribute.type'

function Attribute({
  attribute,
  onClick = () => {},
  active = false
}: {
  attribute: ProductAttribute
  onClick?: () => void
  active?: boolean
}) {
  const { color } = attribute
  const { t } = useTranslation()
  return attribute.stock > 0 ? (
    <div
      onClick={onClick}
      className={`p-1 cursor-pointer hover:border-blue-500 border rounded-full me-2 ${active && 'border-red-600'}`}
    >
      <div className='w-6 h-6 rounded-full' style={{ background: color.code }}></div>
    </div>
  ) : (
    <Tooltip placement='bottom' title={t('cart:outOfStock')}>
      <div className={`p-1 opacity-50 border border-black rounded-full me-2 `}>
        <div className='w-6 h-6 rounded-full' style={{ background: color.code }}></div>
      </div>
    </Tooltip>
  )
}
export default Attribute
