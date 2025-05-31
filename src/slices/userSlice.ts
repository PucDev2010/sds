import { createSlice } from '@reduxjs/toolkit'
import authApi from '~/api/auth.api'
import { User } from '~/types/user.type'

type UserSlice = {
  isAuthenticated: boolean
  profile: User | null
}

const initiallUser: UserSlice = {
  isAuthenticated: false,
  profile: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initiallUser,
  reducers: {
    setUser(_, action) {
      return action.payload
    },
    setProfile(state, action) {
      return { ...state, profile: action.payload }
    },
    setIsAuthenticated(state, action) {
      return { ...state, isAuthenticated: action.payload }
    },
    logout() {
      authApi.logout()
      return initiallUser
    }
  }
})

export default userSlice.reducer
export const { setUser, setProfile, setIsAuthenticated, logout } = userSlice.actions
