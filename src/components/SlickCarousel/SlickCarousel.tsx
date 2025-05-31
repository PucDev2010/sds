import { Settings } from 'react-slick'
import Slider from 'react-slick'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import './SlickCarousel.css'
type SlickCarouselProps = {
  children?: React.ReactNode
  setting?: Settings
  nextArrow?: JSX.Element
  prevArrow?: JSX.Element
  alignLeft?: boolean
}
const NextArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className='slick-carousel-btn right-2 opacity- bg-blue-900 text-white hover:bg-blue-950 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
    >
      <RightOutlined />
    </button>
  )
}

const PrevArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className='slick-carousel-btn left-2 opacity- bg-blue-900 text-white hover:bg-blue-950 transition-colors dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
    >
      <LeftOutlined />
    </button>
  )
}
function SlickCarousel({
  children,
  setting,
  nextArrow = <NextArrow />,
  prevArrow = <PrevArrow />,
  alignLeft = false
}: SlickCarouselProps) {
  const slickSettings: Settings = {
    infinite: true,
    speed: 500,
    swipe: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow,
    prevArrow,
    ...setting
  }

  return (
    <Slider className={`slick-carousel-wrapper ${alignLeft ? 'left' : ''}`} {...slickSettings}>
      {children}
    </Slider>
  )
}

export default SlickCarousel
