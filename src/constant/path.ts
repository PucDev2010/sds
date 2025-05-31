const path = {
  home: '/',
  login: '/login',
  register: '/register',
  forgetpassword: '/forget-password',
  resetpassword: '/reset-password',
  oauth2redirect: '/oauth2redirect',
  verifyInformation: '/verify-information',
  products: '/products',
  productDetail: '/product-detail/:name',
  product: '/product-detail',
  guide: '/guide',
  contact: '/contact',
  about: '/about',
  me: '/me',
  changePassword: '/change-password',
  address: '/address',
  orderManagement: '/order-management',
  cart: '/cart',
  purchase: '/purchase',
  orderSuccess: '/order-success',
  coupon: '/coupon',
  meMobile: '/me-mobile',
  vnpayReturn: '/vnpay-return',
  productVoucher: '/product-voucher',
  userVoucher: '/user-voucher'
} as const

export default path
