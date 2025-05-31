import { createSlice } from '@reduxjs/toolkit'
import { Theme } from '~/types/utils.type'
import { getThemeFromLS } from '~/utils/utils'

const initialTheme: Theme = getThemeFromLS()

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialTheme,
  reducers: {
    setTheme: (state, action) => {
      return action.payload
    }
  }
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
