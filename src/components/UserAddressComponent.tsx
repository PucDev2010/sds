import { Select } from 'antd'
import { memo, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import addressApi from '~/api/address.api'
import { AddressItem, Address } from '~/types/user.type'
import { convertDistrictsRespone, convertProvincesRespone, convertWardsRespone } from '~/utils/address.utils'
import QueryKey from '~/constant/queryKey'

const initialProvince: AddressItem = { value: '', label: 'Chọn tỉnh / thành phố' }
const initialDistrict: AddressItem = { value: '', label: 'Chọn quận / huyện' }
const initialWard: AddressItem = { value: '', label: 'Chọn phường / xã' }

type UserAddressProps = {
  className?: string
  itemClassName?: string
  onAddressChange: (value: Address) => void
  address?: Address
}

type AddressData = {
  provinces: AddressItem[]
  districts: AddressItem[]
  wards: AddressItem[]
}

type SelectedAddress = {
  province: AddressItem
  district: AddressItem
  ward: AddressItem
}
const initialSelectedAddress: SelectedAddress = {
  province: initialProvince,
  district: initialDistrict,
  ward: initialWard
}
const initialAddressData: AddressData = {
  provinces: [],
  districts: [],
  wards: []
}

function UserAddressComponent({ className, itemClassName, onAddressChange, address }: UserAddressProps) {
  const [addressData, setAddressData] = useState<AddressData>(initialAddressData)
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>(initialSelectedAddress)
  const [firstCallApi, setFirstCallApi] = useState(true)

  const fetchProvince = useMutation({
    mutationKey: [QueryKey.fetchProvince],
    mutationFn: addressApi.fetchProvince,
    onSuccess: (res) => {
      setAddressData((prev) => ({ ...prev, provinces: convertProvincesRespone(res.data.data) }))
    },
    cacheTime: 24 * 60 * 1000
  })

  const fetchDistrict = useMutation({
    mutationKey: [QueryKey.fetchDistrict],
    mutationFn: () => {
      return addressApi.fetchDistrictByProvince(selectedAddress.province.value)
    },
    onSuccess: (res) => {
      setAddressData((prev) => ({ ...prev, districts: convertDistrictsRespone(res.data.data) }))
    },
    cacheTime: 24 * 60 * 1000
  })

  const fetchWard = useMutation({
    mutationKey: [QueryKey.fetchWard],
    mutationFn: () => {
      return addressApi.fetchWardByDistrict(selectedAddress.district.value)
    },
    onSuccess: (res) => {
      setAddressData((prev) => ({ ...prev, wards: convertWardsRespone(res.data.data) }))
    },
    cacheTime: 24 * 60 * 1000
  })
  const fetchAddress = useMutation({
    mutationFn: (address: Address) => {
      return addressApi.fetchAddress(address)
    },
    onSuccess: ([provinces, districts, wards], address) => {
      setAddressData({ provinces, districts, wards })
      setSelectedAddress({
        province: { label: address.province || '', value: address.provinceCode || '' },
        district: { label: address.district || '', value: address.districtCode || '' },
        ward: { label: address.ward || '', value: address.wardCode || '' }
      })
    }
  })

  useEffect(() => {
    if (address?.districtCode && address?.wardCode && address?.provinceCode && firstCallApi) {
      if (selectedAddress.province.value) {
        setFirstCallApi(false)
      }
    }
  }, [selectedAddress])

  useEffect(() => {
    if (address && firstCallApi) {
      if (address?.districtCode && address?.wardCode && address?.provinceCode) {
        fetchAddress.mutate(address)
      } else {
        setFirstCallApi(false)
      }
    } else {
      setFirstCallApi(false)
    }
  }, [])

  useEffect(() => {
    if (!firstCallApi) {
      fetchProvince.mutate()
    }
  }, [firstCallApi])

  useEffect(() => {
    if (!firstCallApi) {
      setSelectedAddress((prev) => ({ ...prev, district: initialDistrict, ward: initialWard }))
      if (selectedAddress.province.value) {
        fetchDistrict.mutate()
      }
    }
  }, [selectedAddress.province])

  useEffect(() => {
    if (!firstCallApi) {
      if (selectedAddress.district.value) {
        fetchWard.mutate()
      } else {
        setAddressData((prev) => ({ ...prev, wards: [] }))
      }
      setSelectedAddress((prev) => ({ ...prev, ward: initialWard }))
    }
  }, [selectedAddress.district])

  useEffect(() => {
    onAddressChange(getData())
  }, [selectedAddress])

  const handleProvinceChange = (value: string, option: {}) => {
    setSelectedAddress((prev) => ({ ...prev, province: option as AddressItem }))
  }

  const handleDistrictChange = (value: string, option: {}) => {
    setSelectedAddress((prev) => ({ ...prev, district: option as AddressItem }))
  }

  const handleWardChange = (value: string, option: {}) => {
    setSelectedAddress((prev) => ({ ...prev, ward: option as AddressItem }))
  }

  const getData = (): Address => {
    if (!selectedAddress.province?.value || !selectedAddress.district?.value || !selectedAddress.ward?.value) {
      return { isValid: false }
    } else {
      return {
        id: address?.id,
        isValid: true,
        province: selectedAddress.province.label,
        provinceCode: selectedAddress.province.value,
        district: selectedAddress.district.label,
        districtCode: selectedAddress.district.value,
        ward: selectedAddress.ward.label,
        wardCode: selectedAddress.ward.value
      }
    }
  }

  return (
    <div className={`w-full flex ${className}`}>
      <div className={itemClassName}>
        <Select
          onChange={handleProvinceChange}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          optionFilterProp='children'
          showSearch
          placeholder='Chọn tỉnh thành phố'
          className='w-full'
          options={addressData.provinces}
          loading={fetchAddress.isLoading || fetchProvince?.isLoading}
          value={selectedAddress.province.label}
          disabled={fetchProvince.isLoading}
        />
      </div>
      <div className={itemClassName}>
        <Select
          onChange={handleDistrictChange}
          placeholder='Chọn quận huyện'
          className='w-full'
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          optionFilterProp='children'
          showSearch
          options={addressData.districts}
          loading={fetchAddress.isLoading || fetchDistrict?.isLoading}
          value={selectedAddress.district.label}
          disabled={fetchDistrict.isLoading || fetchProvince.isLoading}
        />
      </div>
      <div className={itemClassName}>
        <Select
          onChange={handleWardChange}
          placeholder='Chọn phường xã'
          className='w-full'
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          optionFilterProp='children'
          showSearch
          options={addressData.wards}
          loading={fetchAddress.isLoading || fetchWard?.isLoading}
          value={selectedAddress.ward.label}
          disabled={fetchWard.isLoading || fetchDistrict.isLoading || fetchProvince.isLoading}
        />
      </div>
    </div>
  )
}
export default memo(UserAddressComponent)
