import { Outlet } from 'react-router-dom'

import Sidebar from '../gis/components/layout/Sidebar/Sidebar'
import Navbar from '../gis/components/layout/Navbar/Navbar'

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
