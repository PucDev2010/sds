import { createSlice } from '@reduxjs/toolkit'
import { CartProduct } from '~/types/product.type'
import { Voucher } from '~/types/voucher.type'
export const initialPreOrder: {
  preOrderItems: CartProduct[]
  voucher: Voucher | null
} = {
  preOrderItems: [],
  voucher: null
}

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialPreOrder,
  reducers: {
    setPreOrder(_, action) {
      return action.payload
    },
    clearPreOrder() {
      return initialPreOrder
    }
  }
})
export const { setPreOrder, clearPreOrder } = orderSlice.actions
export default orderSlice.reducer
