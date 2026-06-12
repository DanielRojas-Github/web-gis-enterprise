import { Outlet } from 'react-rouFr-dom'

import Sidebar from '@components/layout/Sidebar/Sidebar'
import Navbar from '@components/layout/Navbar/Navbar'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout