import { DistrictResponse, ProvinceResponse, WardResponse } from '~/types/address.type'
import axios from 'axios'
import { convertDistrictsRespone, convertProvincesRespone, convertWardsRespone } from '~/utils/address.utils'
import { Address, UserAddress } from '~/types/user.type'
import http from './http'
import { SuccessResponse } from '~/types/utils.type'

const addressBaseUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data'
const provinceUrl = `${addressBaseUrl}/province`
const districtUrl = `${addressBaseUrl}/district`
const wardUrl = `${addressBaseUrl}/ward`
const ADRESS_URL = 'user/address'

const headers = {
  Token: import.meta.env.VITE_GHN_API_TOKEN
}

const addressApi = {
  fetchProvince: () => {
    return axios.get<SuccessResponse<ProvinceResponse[]>>(provinceUrl, {
      headers
    })
  },
  fetchDistrictByProvince: (provinceId: string) => {
    return axios.get<SuccessResponse<DistrictResponse[]>>(districtUrl, {
      params: { province_id: provinceId },
      headers
    })
  },
  fetchWardByDistrict: (districtId: string) => {
    return axios.get<SuccessResponse<WardResponse[]>>(wardUrl, {
      params: { district_id: districtId },
      headers
    })
  },
  fetchAddress: ({ provinceCode, districtCode }: Address) => {
    return Promise.all([
      addressApi.fetchProvince().then((res) => convertProvincesRespone(res.data.data)),
      addressApi.fetchDistrictByProvince(provinceCode || '').then((res) => convertDistrictsRespone(res.data.data)),
      addressApi.fetchWardByDistrict(districtCode || '').then((res) => convertWardsRespone(res.data.data))
    ])
  },
  save(body: UserAddress) {
    return http.post<SuccessResponse<UserAddress>>(ADRESS_URL, body)
  },
  delete(id: number) {
    return http.delete<SuccessResponse<{}>>(ADRESS_URL, { params: { id } })
  },
  setDefault(id: number) {
    return http.put<SuccessResponse<{}>>('user/default-address/' + id)
  }
}
export default addressApi
