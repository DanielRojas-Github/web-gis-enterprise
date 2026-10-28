import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@services/api/axios'

function Navbar() {
  const navigate = useNavigate()
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    try {
      const { data } = await api.post('/auth/logout')

      if (data.logoutUrl) {
        window.location.assign(data.logoutUrl)
        return
      }

      navigate('/login?logged_out=1', { replace: true })
    } catch {
      setLogoutError('No se pudo cerrar la sesión. Inténtalo nuevamente.')
    }
  }

  return (
    <header className="navbar">
      <h2>Web GIS Enterprise</h2>
      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
      {logoutError && <p role="alert">{logoutError}</p>}
    </header>
  )
}

export default Navbar
