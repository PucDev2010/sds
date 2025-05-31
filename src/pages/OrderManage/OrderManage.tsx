import OrderList from './components/OrderList'
import OrderManageNav from './components/OrderManageNav'

function OrderManage() {
  return (
    <div className='text-primary'>
      <OrderManageNav />
      <OrderList />
    </div>
  )
}

export default OrderManage
