export interface SuccessResponse<Data> {
  success: boolean
  message: string
  errorCode?: number
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  errorCode?: number
  data?: Data
}
export interface PageRequest {
  page: number
  pageSize: number
}
export type VnpayTransationType = '01' | '02' | '03'
export type VnpayTransationStatus = '00' | '01' | '02' | '04' | '05' | '06' | '07' | '09'

export interface VnpayQueryDR {
  vnp_ResponseId: string
  vnp_Amount: string
  vnp_OrderInfo: string
  vnp_ResponseCode: string
  vnp_Message: string
  vnp_BankCode: string
  vnp_TransactionNo: string
  vnp_TransactionType: VnpayTransationType
  vnp_TransactionStatus: VnpayTransationStatus
  vnp_CardNumber: string
  vnp_CardHolder: string
  vnp_FeeAmount: string
}
// cú pháp `-?` sẽ loại bỏ undefiend của key optional
export type Theme = 'light' | 'dark'
export type Locale = 'vi' | 'en'
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
