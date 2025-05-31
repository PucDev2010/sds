import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import COMMON_EN from '~/locales/en/common.json'
import COMMON_VI from '~/locales/vi/common.json'
import MESSAGE_EN from '~/locales/en/message.json'
import MESSAGE_VI from '~/locales/vi/message.json'
import MAIN_LAYOUT_EN from '~/locales/en/mainLayout.json'
import MAIN_LAYOUT_VI from '~/locales/vi/mainLayout.json'
import FORM_LAYOUT_EN from '~/locales/en/formLayout.json'
import FORM_LAYOUT_VI from '~/locales/vi/formLayout.json'
import ME_LAYOUT_EN from '~/locales/en/meLayout.json'
import ME_LAYOUT_VI from '~/locales/vi/meLayout.json'
import HOME_EN from '~/locales/en/home.json'
import HOME_VI from '~/locales/vi/home.json'
import LOGIN_EN from '~/locales/en/login.json'
import LOGIN_VI from '~/locales/vi/login.json'
import REGISTER_EN from '~/locales/en/register.json'
import REGISTER_VI from '~/locales/vi/register.json'
import FORGET_PASSWORD_EN from '~/locales/en/forgetPassword.json'
import FORGET_PASSWORD_VI from '~/locales/vi/forgetPassword.json'
import RESET_PASSWORD_EN from '~/locales/en/resetPassword.json'
import RESET_PASSWORD_VI from '~/locales/vi/resetPassword.json'
import VERIFY_EN from '~/locales/en/verify.json'
import VERIFY_VI from '~/locales/vi/verify.json'
import PRODUCT_DETAIL_EN from '~/locales/en/productDetail.json'
import PRODUCT_DETAIL_VI from '~/locales/vi/productDetail.json'
import PRODUCTS_EN from '~/locales/en/products.json'
import PRODUCTS_VI from '~/locales/vi/products.json'
import CART_EN from '~/locales/en/cart.json'
import CART_VI from '~/locales/vi/cart.json'
import ORDER_SUCESS_EN from '~/locales/en/orderSuccess.json'
import ORDER_SUCESS_VI from '~/locales/vi/orderSuccess.json'
import ME_EN from '~/locales/en/me.json'
import ME_VI from '~/locales/vi/me.json'
import ORDER_MANAGE_EN from '~/locales/en/orderManage.json'
import ORDER_MANAGE_VI from '~/locales/vi/orderManage.json'
import ADDRESS_BOOK_EN from '~/locales/en/addressBook.json'
import ADDRESS_BOOK_VI from '~/locales/vi/addressBook.json'
import CHANGE_PASSWORD_EN from '~/locales/en/changePassword.json'
import CHANGE_PASSWORD_VI from '~/locales/vi/changePassword.json'
import PURCHASE_EN from '~/locales/en/purchase.json'
import PURCHASE_VI from '~/locales/vi/purchase.json'
import COUPON_EN from '~/locales/en/coupon.json'
import COUPON_VI from '~/locales/vi/coupon.json'
import SHOPPING_GUIDE_EN from '~/locales/en/shoppingGuide.json'
import SHOPPING_GUIDE_VI from '~/locales/vi/shoppingGuide.json'

import { getLocaleFromLS } from '~/utils/utils'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    common: COMMON_EN,
    message: MESSAGE_EN,
    mainLayout: MAIN_LAYOUT_EN,
    formLayout: FORM_LAYOUT_EN,
    meLayout: ME_LAYOUT_EN,
    home: HOME_EN,
    login: LOGIN_EN,
    register: REGISTER_EN,
    forgetPassword: FORGET_PASSWORD_EN,
    resetPassword: RESET_PASSWORD_EN,
    verify: VERIFY_EN,
    productDetail: PRODUCT_DETAIL_EN,
    cart: CART_EN,
    orderSuccess: ORDER_SUCESS_EN,
    products: PRODUCTS_EN,
    me: ME_EN,
    orderManage: ORDER_MANAGE_EN,
    addressBook: ADDRESS_BOOK_EN,
    changePassword: CHANGE_PASSWORD_EN,
    purchase: PURCHASE_EN,
    coupon: COUPON_EN,
    shoppingGuide: SHOPPING_GUIDE_EN
  },
  vi: {
    common: COMMON_VI,
    message: MESSAGE_VI,
    mainLayout: MAIN_LAYOUT_VI,
    formLayout: FORM_LAYOUT_VI,
    meLayout: ME_LAYOUT_VI,
    home: HOME_VI,
    login: LOGIN_VI,
    register: REGISTER_VI,
    forgetPassword: FORGET_PASSWORD_VI,
    resetPassword: RESET_PASSWORD_VI,
    verify: VERIFY_VI,
    productDetail: PRODUCT_DETAIL_VI,
    cart: CART_VI,
    orderSuccess: ORDER_SUCESS_VI,
    products: PRODUCTS_VI,
    me: ME_VI,
    orderManage: ORDER_MANAGE_VI,
    addressBook: ADDRESS_BOOK_VI,
    changePassword: CHANGE_PASSWORD_VI,
    purchase: PURCHASE_VI,
    coupon: COUPON_VI,
    shoppingGuide: SHOPPING_GUIDE_VI
  }
} as const

export const defaultNS = 'product'

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: getLocaleFromLS(),
  ns: ['home', 'product'],
  fallbackLng: 'vi',
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
export default i18n
