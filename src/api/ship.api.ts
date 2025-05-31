import axios from 'axios'
import config from '~/constant/config'
import { ShipServiceType } from '~/types/order.type'
import { CartProduct } from '~/types/product.type'
import { UserAddress } from '~/types/user.type'
import { SuccessResponse } from '~/types/utils.type'
import { getShipFeeRequestParams } from '~/utils/purchase.utils'
import { convertTimestamp } from '~/utils/utils'

const shipBaseUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order'
const token = import.meta.env.VITE_GHN_API_TOKEN

type ShipFeeResponse = {
  total: number
}

const shipApi = {
  async getShipInformation(cartProduct: CartProduct[], userAddress: UserAddress) {
    try {
      let shipServices = (await this.getShipService(parseInt(userAddress.districtCode || ''))).data.data
      const shipServicePromises = shipServices.map(async (shipService) => {
        try {
          const shipFeeResponse = await this.getShipFee(cartProduct, userAddress, shipService)
          const shipFee = shipFeeResponse.data.data.total

          const shipTimeResponse = await this.getShipTime(userAddress, shipService)
          const shipTime = shipTimeResponse.data.data.leadtime

          return { ...shipService, total: shipFee, leadtime: convertTimestamp(shipTime) } as ShipServiceType
        } catch (error) {
          // Handle errors for individual ship service requests
          console.error(
            `Error occurred while fetching ship fee/time for ship service ${shipService.service_id}:`,
            error
          )
          return null // or handle the error in an appropriate way
        }
      })

      const shipServiceResults = await Promise.allSettled(shipServicePromises)
      const successfulShipServices = shipServiceResults
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<ShipServiceType>).value)
        .filter((shipService) => shipService !== null) as ShipServiceType[]

      return successfulShipServices
    } catch (error) {
      console.error('Error occurred while fetching ship information:', error)
      throw error
    }
  },

  getShipService(toDistrict: number) {
    return axios.get<SuccessResponse<ShipServiceType[]>>(`${shipBaseUrl}/available-services`, {
      headers: {
        token: token
      },
      params: {
        from_district: config.shopInfomation.from_district_id,
        to_district: toDistrict,
        shop_id: config.shopInfomation.shop_id
      }
    })
  },

  getShipFee(cartProduct: CartProduct[], userAddress: UserAddress, shipService: ShipServiceType) {
    return axios.get<SuccessResponse<ShipFeeResponse>>(`${shipBaseUrl}/fee`, {
      headers: {
        Token: token,
        ShopId: config.shopInfomation.shop_id
      },
      params: getShipFeeRequestParams(cartProduct, userAddress, shipService.service_type_id),
      timeout: 10000
    })
  },
  getShipTime(userAddress: UserAddress, shipService: ShipServiceType) {
    return axios.get<SuccessResponse<{ leadtime: number }>>(`${shipBaseUrl}/leadtime`, {
      headers: {
        Token: token,
        ShopId: config.shopInfomation.shop_id
      },
      params: {
        from_district_id: config.shopInfomation.from_district_id,
        from_ward_code: config.shopInfomation.from_ward_code,
        to_district_id: userAddress.districtCode,
        to_ward_code: userAddress.wardCode,
        service_id: shipService.service_id
      },
      timeout: 10000
    })
  }
}

export default shipApi
