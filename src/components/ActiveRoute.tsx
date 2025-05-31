import { NavLink, To } from 'react-router-dom'

function ActiveRoute({
  to,
  children,
  className,
  onClick
}: {
  to: To
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <NavLink onClick={onClick} to={to}>
      <div
        className={`active-route text-primary rounded-sm text-lg transition-all hover:text-gray-950 dark:hover:text-gray-400 ${className}`}
      >
        {children}
      </div>
    </NavLink>
  )
}

export default ActiveRoute
