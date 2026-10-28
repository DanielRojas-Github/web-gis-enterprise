import { Outlet } from 'react-router-dom'
import GISSystemManager from '@/gis/system/GISSytemManager'

import Sidebar from '../gis/components/layout/Sidebar/Sidebar'
import Navbar from '../gis/components/layout/Navbar/Navbar'

function DashboardLayout() {
  return (
    <>
      <GISSystemManager />
      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-content">
          <Navbar />

          <main className="dashboard-main">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
