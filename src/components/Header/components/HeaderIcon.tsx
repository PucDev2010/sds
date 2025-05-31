import { Link } from 'react-router-dom'

function HeaderIcon({ icon, to }: { icon?: React.ReactNode; to?: string }) {
  if (to) {
    return (
      <Link to={to}>
        <div className='w-10 h-10 mx-1 rounded-full flex items-center justify-center transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 '>
          {icon}
        </div>
      </Link>
    )
  } else {
    return (
      <div className='w-10 h-10 mx-1 rounded-full flex items-center justify-center transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 '>
        {icon}
      </div>
    )
  }
}

export default HeaderIcon
