import './SaleLabel.css'

function SaleLabel({ sale }: { sale: number }) {
  return (
    <div className='sale-label relative  text-sm text-white flex justify-center items-center'>
      <span>{sale * 100}%</span>
    </div>
  )
}

export default SaleLabel
