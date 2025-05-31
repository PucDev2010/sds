import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import images from '~/assets/images'
import config from '~/constant/config'
import path from '~/constant/path'
import { RootState } from '~/store/store'

type LogoProps = {
  className?: string
  type?: 'link' | 'default'
  width?: number
  height?: number
}

function Logo({ className = '', type = 'link', width = 140, height = 62 }: LogoProps) {
  const theme = useSelector((state: RootState) => state.theme)
  if (type === 'link') {
    return (
      <Link to={path.home}>
        <img
          className={className}
          style={{ height: `${height}px`, width: `${width}px` }}
          src={theme === config.darkTheme ? images.darkLogo : images.lightLogo}
          alt='logo'
        />
      </Link>
    )
  } else {
    return (
      <img
        className={className}
        width={width}
        height={height}
        src={theme === config.darkTheme ? images.darkLogo : images.lightLogo}
        alt='logo'
      />
    )
  }
}

export default Logo
