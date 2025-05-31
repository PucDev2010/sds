import MobileNav from '~/components/Footer/components/MobileNav'
import UserLayoutSidebar from '~/layout/UserLayout/components/UserLayoutSidebar'

function MeMobile() {
  return (
    <>
      <div className='min-h-screen bg-primary pt-4'>
        <UserLayoutSidebar />
      </div>
      <MobileNav />
    </>
  )
}

export default MeMobile
