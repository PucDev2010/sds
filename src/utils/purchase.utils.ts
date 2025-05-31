import config from '~/constant/config'
import { AddressShipService, OrderShipFeeRequest, PackageInformation } from '~/types/order.type'
import { CartProduct } from '~/types/product.type'
import { UserAddress } from '~/types/user.type'
import { getProductAttributePrice } from './product.utils'

export function getPackageInformation(cartProduct: CartProduct[]): PackageInformation {
  // Base size for 1000g
  const baseSize = {
    width: 30,
    height: 10,
    length: 35
  }
  let totalWeight = cartProduct.reduce((acc, curr) => acc + curr.product.weight * curr.quantity, 0)
  if (totalWeight <= 1000) {
    return { ...baseSize, weight: totalWeight }
  }
  const rate = totalWeight / 1000
  return {
    width: Math.ceil(baseSize.width),
    height: Math.ceil(rate * baseSize.height),
    length: Math.ceil(baseSize.length),
    weight: totalWeight
  }
}

export function getAddressShipServiceInformation(userAddress: UserAddress): AddressShipService {
  return {
    to_ward_code: userAddress.wardCode?.toString() as string,
    to_district_id: parseInt(userAddress.districtCode as string),
    from_district_id: config.shopInfomation.from_district_id,
    from_ward_code: config.shopInfomation.from_ward_code
  }
}

export function getShipFeeRequestParams(
  cartProduct: CartProduct[],
  userAddress: UserAddress,
  service_type_id: number
): OrderShipFeeRequest {
  const addressInformation = getAddressShipServiceInformation(userAddress)
  const packageInformation = getPackageInformation(cartProduct)

  return {
    ...addressInformation,
    ...packageInformation,
    cod_value: 0,
    insurance_value: cartProduct.reduce(
      (acc, curr) => acc + getProductAttributePrice(curr.productAttribute) * curr.quantity,
      0
    ),
    service_type_id
  }
}
