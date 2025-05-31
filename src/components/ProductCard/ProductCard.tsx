import { Image } from 'antd'
import { Link } from 'react-router-dom'
import path from '~/constant/path'

import { Product } from '~/types/product.type'
import { useTranslation } from 'react-i18next'

import { formatCurrency, formatNumberToSocialStyle, generateNameId, getImageUrl } from '~/utils/utils'
import ProductRating from '../ProductRating'
import SaleLabel from '../SaleLabel'
type ProductProps = {
  product: Product
  loading?: boolean
}

function ProductCard({ product }: ProductProps) {
  const { t } = useTranslation()
  const { thumbnail, rate, totalRate, minPrice, maxPrice, sold, name, id, salePercent } = product
  return (
    <div className='p-2'>
      <div className='border p-2 rounded-md relative hover:shadow-lg'>
        {salePercent > 0 && (
          <div className='absolute'>
            <SaleLabel sale={salePercent} />
          </div>
        )}
        <div className='w-full h-40 overflow-hidden'>
          <Image src={getImageUrl(thumbnail)} />
        </div>
        <Link className='block' to={`${path.product}/${generateNameId({ name, id: id + '' })}`}>
          <h4 className='truncate text-primary pt-1 text-md font-semibold mb-1'>{product.name}</h4>
          <div className='flex items-center justify-between mb-1'>
            <ProductRating rating={rate} totalRate={totalRate} />
            <span className='text-primary text-gray-700 text-xs md:text-sm '>
              {t('common:sold')}: {formatNumberToSocialStyle(sold)}
            </span>
          </div>
          <div className='flex text-base md:text-lg text-red-600 font-semibold overflow-x-auto '>
            <span className='block me-1 sm:me-2'>{formatCurrency(minPrice)}</span>
            {maxPrice !== minPrice && <span>{`- ${formatCurrency(maxPrice)}`}</span>}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
