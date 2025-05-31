import { Col, Row } from 'antd'

import './products.css'
import Aside from './components/Aside'
import PageProduct from './components/PageProduct'
import Sorter from './components/Sorter'
function Products() {
  return (
    <div className='product-layout-padding my-2 md:my-6'>
      <Row gutter={[8, 8]}>
        <Col lg={6} md={24}>
          <div className='hidden lg:block'>
            <Aside />
          </div>
        </Col>
        <Col lg={18} md={24} sm={24} xs={24}>
          <Sorter />
          <PageProduct />
        </Col>
      </Row>
    </div>
  )
}

export default Products
