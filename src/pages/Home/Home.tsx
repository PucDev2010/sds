import { useTranslation } from 'react-i18next'

import HeaderCarousel from '~/components/HeaderCarousel/HeaderCarousel'
import QueryKey from '~/constant/queryKey'
import ListProductCarousel from './components/ListProductCarousel'
import ListCategory from './components/ListCategory'
import FlashSaleIcon from '~/components/CustomIcon/FlashSaleIcon'
import { defaultPaginationProduct, orderBy, sortBy } from '~/hooks/useQueryConfig'
import ListProduct from './components/ListProducts'
import NewIcon from '~/components/CustomIcon/NewIcon'
import TopRatingIcon from '~/components/CustomIcon/TopRatingIcon'
import ShopInfomation from '~/components/ShopInfomation'

function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <HeaderCarousel />
      {/* List category */}
      <ListCategory />
      {/* Sale */}
      <div className='layout-padding mt-5'>
        <div className='flex items-center py-2 ps-2'>
          <FlashSaleIcon style={{ fontSize: '2rem' }} className='text-red-500 me-2 text-primary' />
          <h3 className='text-2xl font-semibold text-primary'>{t('common:flashSale')}</h3>
        </div>
      </div>
      <ListProductCarousel
        queryConfig={{ ...defaultPaginationProduct, sale: 'true' }}
        queryKey={QueryKey.fetchSaleProduct}
      />
      {/* New Product */}
      <ListProduct queryParams={{ sortBy: sortBy.createdAt, order: orderBy.desc }}>
        <div className='flex items-center py-2 ps-2'>
          <NewIcon style={{ fontSize: '2rem' }} className='me-2 text-primary' />
          <h3 className='text-2xl font-semibold text-primary'>{t('common:newProduct')}</h3>
        </div>
      </ListProduct>
      {/* Most sold Product */}
      <ListProduct queryParams={{ sortBy: sortBy.rate, order: orderBy.desc }}>
        <div className='flex items-center py-2 ps-2'>
          <TopRatingIcon style={{ fontSize: '2rem' }} className='me-2 text-primary' />
          <h3 className='text-2xl font-semibold text-primary'>{t('common:topRate')}</h3>
        </div>
      </ListProduct>
      <ShopInfomation />
    </div>
  )
}

export default Home
