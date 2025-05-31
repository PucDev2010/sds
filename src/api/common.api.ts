import brandApi from './brand.api'
import categoryApi from './category.api'

const commonApi = {
  fetchCommonData() {
    return Promise.all([
      categoryApi.fetchAll({ deleted: false }).then((res) => res.data.data),
      brandApi.fetchAll({ deleted: false }).then((res) => res.data.data)
    ])
  }
}
export default commonApi
