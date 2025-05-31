const BACK_END_URL = import.meta.env.VITE_BACK_END_URL
const CLIENT_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL

export const OAUTH2_REDIRECT_URI = `${CLIENT_BASE_URL}/oauth2redirect`

export const GOOGLE_AUTH_URL = BACK_END_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI
export const FACEBOOK_AUTH_URL = BACK_END_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI
export const GITHUB_AUTH_URL = BACK_END_URL + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI

export const ROLE = {
  guest: 'ROLE_GUEST',
  admin: 'ROLE_ADMIN',
  user: 'ROLE_USER'
}
// http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3001
