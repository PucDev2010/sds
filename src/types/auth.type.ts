import { User } from './user.type'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenReponse {
  accessToken: string
}
