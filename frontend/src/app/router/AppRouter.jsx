import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import DashboardLayout from '@layouts/DashboardLayout'

import DashboardPage from '@pages/Dashboard/DashboardPage'
import MapsPage from '@pages/Maps/MapsPage'
import LoginPage from '@pages/Login/LoginPage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'

import { ROUTES } from '@constants/routes'

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <DashboardLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.MAPS,
        element: <MapsPage />,
      },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter