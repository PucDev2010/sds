export interface ProvinceResponse {
  ProvinceID: number
  ProvinceName: string
}

export interface DistrictResponse {
  DistrictID: number
  ProvinceID: number
  DistrictName: string
}

export interface WardResponse {
  WardCode: string
  DistrictID: number
  WardName: string
}
