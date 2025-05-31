import { useDispatch } from 'react-redux'
import { clearCart } from '~/slices/cartSlice'
import { logout } from '~/slices/userSlice'

function useLogout() {
  const dispatch = useDispatch()
  const doLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
  }
  return { doLogout }
}

export default useLogout
