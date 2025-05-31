import { Link, useLocation } from 'react-router-dom'
import path from '~/constant/path'
import { generateRedirectUrl } from '~/utils/utils'

function LoginLink({ children, className }: { children?: React.ReactNode; className?: string }) {
  const location = useLocation()
  return (
    <Link className={className} to={{ pathname: path.login, search: generateRedirectUrl(location.pathname) }}>
      {children}
    </Link>
  )
}

export default LoginLink
