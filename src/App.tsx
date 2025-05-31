import { useEffect } from 'react'
import useRouteElements from './useRouteElements'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import { ConfigProvider } from 'antd'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import ScrollTop from './components/ScrollTop/SrollTop'
import themeToken from './constant/theme'
import '~/index.css'
import '~/pages/Coupon/coupon.css'
import config from './constant/config'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

function App() {
  const routeElements = useRouteElements()
  const theme = useSelector((state: RootState) => state.theme)
  useEffect(() => {
    if (theme === config.darkTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <ErrorBoundary>
      <ScrollTop>
        <ConfigProvider
          theme={{
            token: theme === config.darkTheme ? themeToken.dark : themeToken.light
          }}
        >
          {routeElements}
        </ConfigProvider>
      </ScrollTop>
    </ErrorBoundary>
  )
}

export default App
