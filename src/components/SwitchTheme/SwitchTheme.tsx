import { Switch } from 'antd'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import MoonIcon from '../CustomIcon/MoonIcon'
import SunIcon from '../CustomIcon/SunIcon'
import { RootState } from '~/store/store'
import { setTheme } from '~/slices/themeSlice'
import './SwitchTheme.css'
import config from '~/constant/config'

function SwitchTheme({ className = '' }: { className?: string }) {
  const theme = useSelector((state: RootState) => state.theme)
  const dispatch = useDispatch()

  const handleSwitchTheme = (checked: any) => {
    if (checked) {
      dispatch(setTheme(config.darkTheme))
    } else {
      dispatch(setTheme(config.lightTheme))
    }
  }

  return (
    <div className={className}>
      <Switch
        size='default'
        className='theme-toggle-btn'
        checkedChildren={<MoonIcon className='text-yellow-500' />}
        unCheckedChildren={<SunIcon className='text-yellow-500' />}
        onChange={handleSwitchTheme}
        checked={theme === config.darkTheme}
      />
    </div>
  )
}

export default SwitchTheme
