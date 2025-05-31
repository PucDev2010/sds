import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import ConfidenceIcon from '../CustomIcon/ConfidenceIcon'
import CreditCardIcon from '../CustomIcon/CreditCardIcon'
import SupportIcon from '../CustomIcon/Support'
import TruckIcon from '../CustomIcon/TruckIcon'
import { normalizeKey } from '~/utils/utils'

function ShopInfomation() {
  const { t } = useTranslation()
  const datas = [
    {
      title: 'mainLayout:deliveryTitle',
      icon: <TruckIcon />,
      content: 'mainLayout:deliveryContent'
    },
    {
      title: 'mainLayout:paymentTitle',
      icon: <CreditCardIcon />,
      content: 'mainLayout:paymentContent'
    },
    {
      title: 'mainLayout:policyTitle',
      icon: <ConfidenceIcon />,
      content: 'mainLayout:policyContent'
    },
    {
      title: 'mainLayout:supportTitle',
      icon: <SupportIcon />,
      content: 'mainLayout:supportContent'
    }
  ]

  const Item = ({ title, icon, content }: { title: string; icon: React.ReactNode; content: string }) => {
    return (
      <Col xs={24} md={12} lg={6}>
        <div className='bg-primary px-2 h-72 shadow-sm flex flex-col items-center justify-center rounded-lg hover:shadow-xl group transition-all ease-in'>
          <div className='text-3xl w-14 h-14 p-4 group-hover:bg-blue-50 bg-gray-100 flex items-center justify-center rounded-full text-gray-900'>
            {icon}
          </div>
          <h3 className='text-primary text-xl font-semibold my-2'>{t(normalizeKey(title))}</h3>
          <p className='text-primary text-gray-600 text-center mt-1'>{t(normalizeKey(content))}</p>
        </div>
      </Col>
    )
  }

  return (
    <div className='layout-padding my-12'>
      <Row gutter={[8, 8]}>
        {datas.map((data) => {
          const { title, content, icon } = data
          return <Item key={title} title={title} content={content} icon={icon} />
        })}
      </Row>
    </div>
  )
}

export default ShopInfomation
