import { Outlet } from 'react-router-dom'
import Sidebar from '@components/layout/Sidebar/Sidebar'
import Navbar from '@components/layout/Navbar/Navbar'

function DashboardLayout() {
  return (
    <div>
      <Sidebar />

      <div>
        <Navbar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout