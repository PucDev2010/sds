import { Col, Row } from 'antd'
import UserLayoutSidebar from './components/UserLayoutSidebar'

function UserLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className='layout-padding my-2 md:my-6 text-primary'>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} lg={8} xl={6}>
          <div className='hidden md:block '>
            <UserLayoutSidebar />
          </div>
        </Col>
        <Col xs={24} sm={24} lg={16} xl={18}>
          {children}
        </Col>
      </Row>
    </div>
  )
}

export default UserLayout
