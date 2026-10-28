import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from 'react-router-dom'

import DashboardLayout from '@layouts/DashboardLayout'

import DashboardPage from '@pages/Dashboard/DashboardPage'
import MapsPage from '@pages/Maps/MapsPage'
import LoginPage from '@pages/Login/LoginPage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'

import { ROUTES } from '@/shared/constants/routes'
import { ENV } from '@config/env'

const requireAuthentication = async () => {
  const apiUrl = (ENV.API_URL || '/api').replace(/\/$/, '')

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      credentials: 'include',
    })

    if (response.ok) {
      return null
    }
  } catch {
    // Send users to the login page when the API is unavailable.
  }

  return redirect(ROUTES.LOGIN)
}

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    loader: requireAuthentication,
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
