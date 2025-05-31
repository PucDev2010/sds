import { Checkbox } from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import useQueryConfig from '~/hooks/useQueryConfig'
import { Category } from '~/types/category.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '~/constant/path'
import { omit } from 'lodash'

type CategoryFilterProps = {
  categories?: Category[]
}

const CategoryFilter = React.forwardRef<HTMLButtonElement, CategoryFilterProps>(({ categories = [] }, ref) => {
  const [selectedCategorieIds, setSelectedCategorieIds] = useState<number[]>([])
  const navigate = useNavigate()
  const queryConfig = useQueryConfig(16)
  useEffect(() => {
    const searchParams =
      selectedCategorieIds.length > 0
        ? { ...queryConfig, categories: selectedCategorieIds.join(','), page: '0' }
        : omit({ ...queryConfig }, 'categories')
    navigate({
      pathname: path.products,
      search: createSearchParams(searchParams).toString()
    })
  }, [selectedCategorieIds])

  const handleChange = (e: CheckboxChangeEvent) => {
    let cateIds = []
    const value = parseInt(e.target.value)
    if (selectedCategorieIds.includes(value)) {
      cateIds = selectedCategorieIds.filter((id) => id !== value)
    } else {
      cateIds = [...selectedCategorieIds, value]
    }
    setSelectedCategorieIds(cateIds)
  }

  return (
    <div>
      {categories
        ?.filter((category) => !!category.parentId)
        .map((category) => {
          return (
            <div className='my-1' key={category.id}>
              <Checkbox
                checked={queryConfig?.categories?.split(',').includes(category.id.toString())}
                value={category.id}
                onChange={handleChange}
              >
                {category.name}
              </Checkbox>
            </div>
          )
        })}
      <button onClick={() => setSelectedCategorieIds([])} className='hidden' ref={ref}></button>
    </div>
  )
})

export default CategoryFilter
