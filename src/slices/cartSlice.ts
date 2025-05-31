import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import cartApi from '~/api/cart.api'
import { CartProduct } from '~/types/product.type'
import { findIndex } from 'lodash'
import { message } from 'antd'
const initialCart: {
  cart: CartProduct[]
} = {
  cart: []
}

export const addToCart = createAsyncThunk('cart/addToCart', async (cartItem: CartProduct) => {
  try {
    const response = await cartApi.addToCart(cartItem)
    return response.data
  } catch (err: any) {
    message.error(err?.response?.data.message)
    throw err
  }
})

export const themeSlice = createSlice({
  name: 'cart',
  initialState: initialCart,
  reducers: {
    renew(state, action) {
      return {
        ...state,
        cart: action.payload.map((item: CartProduct) => {
          if (item.quantity > item.productAttribute.stock) {
            item.quantity = item.productAttribute.stock
          }
          return item
        })
      }
    },
    removeItem(state, action) {
      if (action.payload && typeof action.payload === 'number') {
        cartApi.deleteItem(action.payload)
        state.cart = state.cart.filter((item) => item.id !== action.payload)
      }
      return state
    },
    clearCart() {
      return initialCart
    },
    removeItemAfterOrder(state, action) {
      cartApi.deleteManyItems(action.payload)
      state.cart = state.cart.filter((item) => !action.payload.includes(item.id))
      return state
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      const response = action.payload.data
      let index = findIndex(state.cart, {
        product: { id: response.product.id },
        productAttribute: { id: response.productAttribute.id }
      })
      if (index > -1) {
        state.cart[index] = response
      } else {
        state.cart = [...state.cart, response]
      }
      return state
    })
  }
})
export const { renew, removeItem, clearCart, removeItemAfterOrder } = themeSlice.actions
export default themeSlice.reducer
