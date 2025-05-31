import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { getColorByName, getImageUrl } from '~/utils/utils'

function MeAvatar({
  className,
  size = 64,
  htmlFor = '',
  image = ''
}: {
  className?: string
  size?: number
  htmlFor?: string
  image?: string
}) {
  const { profile } = useSelector((root: RootState) => root.user)
  let src = profile?.avatar && getImageUrl(profile.avatar)
  if (image) {
    src = image
  }
  return !!!src ? (
    <div className={`relative border rounded-full ${className}`}>
      <Avatar
        style={{ backgroundColor: getColorByName(profile?.firstName || profile?.email || ''), verticalAlign: 'middle' }}
        size={size}
      >
        {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : profile?.email?.charAt(0).toUpperCase()}
      </Avatar>
      {htmlFor && (
        <label
          style={{ bottom: '0', right: '0' }}
          className='absolute cursor-pointer z-10 w-7 h-7 text-red-500 flex items-center justify-center rounded-full border bg-white dark:border-gray-700 hover:opacity-80'
          htmlFor={htmlFor}
        >
          <EditOutlined />
        </label>
      )}
    </div>
  ) : (
    <div className={`relative border rounded-full ${className}`}>
      <Avatar size={size} src={image ? image : src} />
      {htmlFor && (
        <label
          style={{ bottom: '0', right: '0' }}
          className='absolute cursor-pointer z-10 w-7 h-7 text-red-500 flex items-center justify-center rounded-full border bg-white dark:border-gray-700 hover:opacity-80'
          htmlFor={htmlFor}
        >
          <EditOutlined />
        </label>
      )}
    </div>
  )
}

export default MeAvatar
