export interface AddressItem {
  value: string
  label: string
}

export interface Address {
  id?: number
  isValid?: boolean
  province?: string
  provinceCode?: string
  district?: string
  districtCode?: string
  ward?: string
  wardCode?: string
}

export interface UserAddress extends Address {
  name?: string
  phoneNumber?: string
  defaultAddress?: boolean
  detail?: string
}

export interface User {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  gender?: boolean
  avatar?: string
  verified?: boolean
  birthday?: string
  role?: {
    name: string
  }
}

export interface UserInformation extends User {
  userAddress: UserAddress
}
