import { useTranslation } from 'react-i18next'
import ProductRating from '~/components/ProductRating'

function ProductRateAndSold({ rate, totalRate, sold }: { rate: number; totalRate: number; sold: number }) {
  const { t } = useTranslation()
  return (
    <div className='flex py-2 my-2 bg-gray-50 dark:bg-transparent px-2 md:px-8 flex-wrap'>
      <div className='flex text-xl pe-5 border-e-2 border-gray-400'>
        <span className='inline-block me-2 text-red-600 underline'>{rate}</span>
        <ProductRating
          activeClassname='h-4 w-4 fill-red-600'
          nonActiveClassname='h-4 w-4 fill-current text-white stroke-red-500 dark:text-gray-800'
          rating={rate}
          showTotalRate={false}
        />
      </div>
      <div className='flex ms-4 items-end pe-5 border-e-2 border-gray-400'>
        <span className='inline-block me-2 text-primary underline'>{totalRate}</span>
        <span className='text-primary text-gray-500 font-semibold'> {t('common:rate')}</span>
      </div>
      <div className='flex ms-4 items-end pe-5'>
        <span className='inline-block me-2 text-primary underline'>{sold}</span>
        <span className='text-primary text-gray-500 font-semibold'> {t('common:sold')}</span>
      </div>
    </div>
  )
}

export default ProductRateAndSold
