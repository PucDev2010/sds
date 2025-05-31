import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import path from '~/constant/path'
import useQueryConfig from '~/hooks/useQueryConfig'
import { Brand } from '~/types/brand.type'
type BrandFilterProps = {
  brands?: Brand[]
}
const BrandFilter = React.forwardRef<HTMLButtonElement, BrandFilterProps>(({ brands = [] }, ref) => {
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([])
  const navigate = useNavigate()
  const queryConfig = useQueryConfig(16)

  useEffect(() => {
    const searchParams =
      selectedBrandIds.length > 0
        ? { ...queryConfig, brands: selectedBrandIds.join(','), page: '0' }
        : omit({ ...queryConfig }, 'brands')
    navigate({
      pathname: path.products,
      search: createSearchParams(searchParams).toString()
    })
  }, [selectedBrandIds])

  const handleChange = (e: CheckboxChangeEvent) => {
    let brandIds = []
    const value = parseInt(e.target.value)
    if (selectedBrandIds.includes(value)) {
      brandIds = selectedBrandIds.filter((id) => id !== value)
    } else {
      brandIds = [...selectedBrandIds, value]
    }
    setSelectedBrandIds(brandIds)
  }

  return (
    <div>
      {brands?.map((brand) => {
        return (
          <div className='my-1' key={brand.id}>
            <Checkbox
              onChange={handleChange}
              value={brand.id}
              checked={queryConfig?.brands?.split(',').includes(brand.id.toString())}
            >
              {brand.name}
            </Checkbox>
          </div>
        )
      })}
      <button onClick={() => setSelectedBrandIds([])} className='hidden' ref={ref}></button>
    </div>
  )
})

export default BrandFilter
