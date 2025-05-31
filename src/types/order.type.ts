import { PaymentMethod } from './PaymentMethod.type'
import { ProductAttribute } from './product.attribute.type'
import { CartProduct, Product } from './product.type'
import { User, UserAddress } from './user.type'
import { Voucher } from './voucher.type'

export type OrderStatusType = 'processing' | 'delivering' | 'delivered' | 'cancelled'

export interface OrderDTO {
  id?: number
  orderStatus?: string
  note?: string
  user?: User
  orderItemDTOS: CartProduct[]
  voucher?: Voucher
  userAddress: UserAddress
  shipFee: number
  paymentMethod: PaymentMethod
  transportName?: string
  wardCode: string
  districtId: number
  serviceTypeId: number
}

export interface OrderItem {
  id: number
  quantity: number
  price: number
  discount: number
  productAttribute: ProductAttribute
  product: Product
}

export interface Order {
  id: number
  orderStatus: OrderStatusType
  note?: string
  totalPayment: number
  discount: number
  address: string
  phone: string
  orderItems: OrderItem[]
  rated: boolean
  shipFee: number
  payDate: string
  transportName: string
  paymentStatus: 'pending' | 'paid' | 'faile' | 'refund'
  shipCode: string
  wardCode: string
  districtId: number
  serviceTypeId: number
}
export interface OrderSuccessResponse {
  paymentUrl: string
  orderId: number
  amount: number
}
export interface PackageInformation {
  weight: number
  width: number
  height: number
  length: number
}

export interface AddressShipService {
  from_district_id: number
  from_ward_code: string
  to_ward_code: string
  to_district_id: number
}

export interface OrderShipFeeRequest extends PackageInformation, AddressShipService {
  service_type_id: number
  insurance_value: number
  cod_value: number
}

export interface ShipServiceType {
  service_id: number
  short_name: string
  service_type_id: number
  leadtime?: string
  total?: number
  isError?: boolean
}
