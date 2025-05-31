import { Badge } from 'antd'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '~/utils/utils'

function ProductPrice({
  maxPrice,
  minPrice,
  sale = 0,
  origin = 0
}: {
  minPrice: number
  maxPrice: number
  sale?: number
  origin?: number
}) {
  const { t } = useTranslation()
  return (
    <>
      {sale > 0 ? (
        <Badge.Ribbon
          text={
            <div>
              {`${t('common:sale')} `}
              {sale * 100}%
            </div>
          }
          color='red'
        >
          <div className='flex flex-wrap py-2 my-2 text-lg md:text-2xl lg:text-3xl bg-gray-50 dark:bg-transparent px-2 md:px-8 text-red-600 font-semibold'>
            {origin > 0 && (
              <span className='text-lg text-gray-500 flex items-start me-2 line-through'>
                {formatCurrency(origin)}
                <span className='inline-block ms-1 underline text-lg'>đ</span>
              </span>
            )}
            <span className='flex items-start me-2'>
              {formatCurrency(minPrice)}
              <span className='inline-block ms-1 underline text-lg'>đ</span>
            </span>
            {maxPrice !== minPrice && (
              <span className='flex items-start'>
                {`- ${formatCurrency(maxPrice)}`}
                <span className='inline-block ms-1 underline text-lg'>đ</span>
              </span>
            )}
          </div>
        </Badge.Ribbon>
      ) : (
        <div className='flex flex-wrap py-2 my-2 text-lg md:text-2xl lg:text-3xl bg-gray-50 dark:bg-transparent px-2 md:px-8 text-red-600 font-semibold'>
          <span className='flex items-start me-2'>
            {formatCurrency(minPrice)}
            <span className='inline-block ms-1 underline text-lg'>đ</span>
          </span>
          {maxPrice !== minPrice && (
            <span className='flex items-start'>
              {`- ${formatCurrency(maxPrice)}`}
              <span className='inline-block ms-1 underline text-lg'>đ</span>
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default ProductPrice
