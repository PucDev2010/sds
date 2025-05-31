import { SuccessResponse } from '~/types/utils.type'
import http from './http'
import { User, UserAddress, UserInformation } from '~/types/user.type'

const URL_PROFILE = 'users/me'
const URL_ADDRESS = 'user/address'
const URL_AVATAR = 'users/avatar'

const userApi = {
  updateInformation(body: UserInformation | User) {
    return http.post<SuccessResponse<{}>>(URL_PROFILE, body)
  },
  fetchAllAddress() {
    return http.get<SuccessResponse<UserAddress[]>>(URL_ADDRESS)
  },
  fetchProfile() {
    return http.get<SuccessResponse<User>>(URL_PROFILE)
  },
  updateAvatar(body: FormData) {
    return http.post<SuccessResponse<{ url: string }>>(URL_AVATAR, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  changePassword(body: { password: string; oldPassword: string }) {
    return http.put<SuccessResponse<{}>>('users/me/change-password', body)
  }
}

export default userApi
