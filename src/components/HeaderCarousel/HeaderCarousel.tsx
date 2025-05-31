import { useTranslation } from 'react-i18next'
import Slider, { Settings } from 'react-slick'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'

import images from '~/assets/images'
import './HeaderCarousel.css'

const NextArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className='header-carousel-btn bg-blue-900 text-white hover:bg-blue-950 right-2 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
    >
      <RightOutlined />
    </button>
  )
}

const PrevArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className='header-carousel-btn bg-blue-900 text-white hover:bg-blue-950 transition-colors left-2 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
    >
      <LeftOutlined />
    </button>
  )
}

const settings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />
}
function HeaderCarousel() {
  const { t } = useTranslation()
  const slides = [
    {
      src: images.slide1,
      title: t('mainLayout:carouselBlackPinkTitle')
    },
    {
      src: images.slide2,
      title: t('mainLayout:carouselCocoCrushTitle')
    }
  ]
  return (
    <div className='header-carousel-wrapper relative'>
      <Slider className='relative' {...settings}>
        {slides.map((slide, index) => {
          return (
            <div key={index}>
              <img src={slide.src} />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default HeaderCarousel
