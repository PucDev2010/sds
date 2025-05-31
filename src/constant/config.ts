import { PaymentMethod } from '~/types/PaymentMethod.type'

const config = {
  baseUrl: `${import.meta.env.VITE_BACK_END_URL}/api/`,
  maxSizeUploadAvatar: 1048576, // bytes,
  darkTheme: 'dark',
  lightTheme: 'light',
  viLocale: 'vi',
  enLocale: 'en',
  maximumAddress: 4,
  shopInfomation: {
    from_district_id: 1454, // Ho chi minh
    from_ward_code: '21204', // Tan chanh hiep,
    shop_id: 124986,
    defaultShipFee: 70000
  },
  shipServices: [
    {
      service_id: 53320,
      short_name: 'Chuyển phát thương mại điện tử',
      service_type_id: 2,
      total: 0
    },
    {
      service_id: 100039,
      short_name: 'Chuyển phát truyền thống',
      service_type_id: 5,
      total: 0
    }
  ],
  paymentMethods: [
    { id: 1, paymentType: 'cod', provider: 'customer', name: 'purchase:cod' },
    { id: 2, paymentType: 'card', provider: 'VnPay', name: 'purchase:paymentWithCard' }
  ] as PaymentMethod[]
}
export default config
