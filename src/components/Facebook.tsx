function FaceBook({
  width = 30,
  height = 30,
  className = ''
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <div className={className}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        data-name='Ebene 1'
        viewBox='0 0 1024 1024'
        id='facebook-logo-2019'
      >
        <path
          fill='#1877f2'
          d='M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z'
        ></path>
        <path
          fill='#fff'
          d='M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z'
        ></path>
      </svg>
    </div>
  )
}

export default FaceBook
