type OverlayProps = {
  style?: React.CSSProperties
  mode?: 'default' | 'hover'
  children?: React.ReactNode
}

function Overlay({ style, mode = 'default', children }: OverlayProps) {
  const baseClass = 'absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-950/50 '
  const classes = () => {
    if (mode === 'default') {
      return baseClass
    } else {
      return baseClass + 'hidden group-hover:block'
    }
  }
  return (
    <div style={style} className={classes()}>
      {children}
    </div>
  )
}

export default Overlay
