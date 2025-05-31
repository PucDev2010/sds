import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from '~/components/Header'
import Footer from '~/components/Footer'

const { Content } = Layout
type MainLayoutProp = {
  children?: React.ReactNode
}

function MainLayout(props: MainLayoutProp) {
  return (
    <div className='font-sans text-primary'>
      <Layout>
        <Header />
        <Content>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </div>
  )
}

export default MainLayout
