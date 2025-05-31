import axios, { AxiosError } from 'axios'
import HttpStatusCode from '~/constant/httpStatusCode.enum'
import { ErrorResponse, PageRequest, SuccessResponse } from '~/types/utils.type'
import backendErrorCode from '~/constant/backendErrorCode'
import config from '~/constant/config'
import type { Theme, Locale, VnpayTransationType, VnpayTransationStatus } from '~/types/utils.type'
import { message } from 'antd'
import path from '~/constant/path'
import { createSearchParams } from 'react-router-dom'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{}>>(error) &&
    error.response?.data?.errorCode === backendErrorCode.TOKEN_EXPIRED
  )
}

export function handleError(err: any) {
  message.error('Oops! Something went wrong')
}

export const showMessageRespone = (res: SuccessResponse<any>) => {
  if (res.success) {
    message.success(res.message)
  } else {
    message.error(res.message || 'error')
  }
}

export function getThemeFromLS(): Theme {
  let theme = localStorage.getItem('theme') || config.lightTheme
  if (theme !== config.darkTheme && theme !== config.lightTheme) {
    theme = config.lightTheme
  }
  return theme as Theme
}

export function setThemeToLS(theme: Theme) {
  localStorage.setItem('theme', theme)
}

export function getLocaleFromLS(): Locale {
  let locale = localStorage.getItem('locale') || config.viLocale
  if (locale !== config.viLocale && locale !== config.enLocale) {
    locale = config.viLocale
  }
  return locale as Locale
}

export function setLocaleToLS(locale: Locale) {
  localStorage.setItem('locale', locale)
}

export function getRedirectUrlFromLS() {
  return localStorage.getItem('redirect') || path.home
}
export function setRedirectUrlToLS(url: string) {
  return localStorage.setItem('redirect', url)
}

export function formatCurrency(currency: number, prefix?: string) {
  return new Intl.NumberFormat('de-DE').format(Math.round(currency)) + (!!prefix ? prefix : '')
}

export function formatNumberToSocialStyle(value: number, alwaysHaveSuffixe?: boolean) {
  let result = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
  return alwaysHaveSuffixe && result === '0' ? result + 'k' : result
}

export function getDiscountPrice(price: number, discount: number) {
  return price * (1 - discount)
}

export function getImageUrl(imageName: string) {
  if (imageName.startsWith('http')) {
    return imageName
  }
  return `${config.baseUrl}images/${imageName}`
}
export const normalizeKey = (key: string) => key as unknown as TemplateStringsArray
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}
export function toPageQuery(pageRequest: PageRequest) {
  return { page: pageRequest.page.toString(), pageSize: pageRequest.pageSize.toString() }
}
export function generateRedirectUrl(path: string) {
  return createSearchParams({ redirect: path }).toString()
}

export function getColorByName(name: String) {
  const firstCharacter = name.charAt(0) || ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let arr = characters.match(/.{1,2}/g)
  let colors = [
    '#ef4444',
    '#fb923c',
    '#db2777',
    '#84cc16',
    '#16a34a',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#2563eb',
    '#4f46e5',
    '#8b5cf6',
    '#a855f7',
    '#d946ef'
  ]
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr?.length; i++) {
      if (arr[i].includes(firstCharacter.toUpperCase())) {
        return colors[i]
      }
    }
  }
  return colors.at(-1)
}
export function convertTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000) // Multiply by 1000 as Unix timestamp is in seconds
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are zero-based, so we add 1
  const year = date.getFullYear()

  // Get the day of the week as a string
  const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
  const dayOfWeek = daysOfWeek[date.getDay()]

  // Format the date
  const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`

  return `${dayOfWeek}, ${formattedDate}`
}
export function roundToThousand(number: number) {
  return Math.round(number / 1000) * 1000
}
export function getAvailablePaymentMethod(value: 'cod' | 'all' | 'card') {
  switch (value) {
    case 'all':
      return 'Tất cả hình thức thanh toán.'
    case 'cod':
      return 'Thanh toán khi nhận hàng'
    case 'card':
      return 'Thanh toán online'
  }
}
export function getVnpayTransactionTypeMessage(code: VnpayTransationType) {
  switch (code) {
    case '01':
      return 'GD thanh toán'
    case '02':
      return 'Giao dịch hoàn trả toàn phần'
    case '03':
      return 'Giao dịch hoàn trả một phần'
  }
}
export function getVnpayTransactionStatusMessage(code: VnpayTransationStatus) {
  switch (code) {
    case '00':
      return 'Giao dịch thanh toán thành công'
    case '01':
      return 'Giao dịch chưa hoàn tất'
    case '02':
      return 'Giao dịch bị lỗi'
    case '04':
      return 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)'
    case '05':
      return 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)'
    case '06':
      return 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)'
    case '07':
      return 'Giao dịch bị nghi ngờ gian lận'
    case '09':
      return 'GD Hoàn trả bị từ chối'
  }
}
