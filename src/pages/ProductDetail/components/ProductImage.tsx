import { Image } from 'antd'
import { useState } from 'react'

import SlickCarousel from '~/components/SlickCarousel/SlickCarousel'
import { ProductImage } from '~/types/product.images'
type ProductImageProps = {
  thumbnail?: string
  images?: ProductImage[]
}
function ProductImage({ thumbnail = '', images = [] }: ProductImageProps) {
  let listImages: string[] = []
  if (thumbnail) {
    listImages = [thumbnail, ...images.map((item) => item.src)]
  }
  const [imgs, setImgs] = useState<string[]>(listImages)
  const [visible, setVisible] = useState(false)
  const [activeImg, setActiveImg] = useState<string>(thumbnail)
  const handleActiveImg = (src: string) => {
    const newImgs = imgs.filter((img) => img !== src)
    setImgs([src, ...newImgs])
    setActiveImg(src)
  }
  const responsive = [
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1
      }
    }
  ]

  return (
    <>
      {listImages.length > 0 && (
        <>
          <Image
            preview={{ visible: false }}
            width={'100%'}
            alt='thumbnail'
            src={activeImg}
            onClick={() => setVisible(true)}
          />
          <div style={{ display: 'none' }}>
            <Image.PreviewGroup
              preview={{
                visible,
                onVisibleChange: (vis) => {
                  setVisible(vis)
                }
              }}
            >
              {imgs.map((src, index) => {
                return <Image key={index} src={src} alt='image' />
              })}
            </Image.PreviewGroup>
          </div>
          <div className='border rounded-md dark:border-gray-600'>
            <SlickCarousel
              setting={{
                infinite: false,
                responsive,
                slidesToShow: 4
              }}
              alignLeft
            >
              {listImages.map((src, index) => {
                return (
                  <div
                    onClick={() => {
                      handleActiveImg(src)
                    }}
                    key={index}
                    className={'p-1 flex items-center justify-center'}
                  >
                    <div
                      className={`rounded-md overflow-hidden h-56 md:h-40 lg:h-32 xl:h-32 xxl:h-32 bg-center bg-no-repeat bg-cover flex justify-center ${
                        src === activeImg && 'border border-red-500 dark:border-gray-600'
                      }`}
                      style={{
                        backgroundImage: `url(${src})`
                      }}
                    ></div>
                  </div>
                )
              })}
            </SlickCarousel>
          </div>
        </>
      )}
    </>
  )
}

export default ProductImage
