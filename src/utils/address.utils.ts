import { DistrictResponse, ProvinceResponse, WardResponse } from '~/types/address.type'
import { AddressItem } from '~/types/user.type'

export const convertProvincesRespone = (provinces: ProvinceResponse[]): AddressItem[] => {
  return provinces.map((item) => ({ label: item.ProvinceName, value: item.ProvinceID.toString() }))
}

export const convertDistrictsRespone = (districts: DistrictResponse[]): AddressItem[] => {
  return districts.map((item) => ({ label: item.DistrictName, value: item.DistrictID.toString() }))
}

export const convertWardsRespone = (wards: WardResponse[]): AddressItem[] => {
  return wards.map((item) => ({ label: item.WardName, value: item.WardCode }))
}
