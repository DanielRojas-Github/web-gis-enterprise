import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ENV } from '@config/env'
import './LoginPage.css'

function LoginPage() {
  const apiUrl = (ENV.API_URL || '/api').replace(/\/$/, '')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [authState, setAuthState] = useState('checking')

  useEffect(() => {
    let active = true

    fetch(`${apiUrl}/auth/me`, { credentials: 'include' })
      .then((response) => {
        if (!active) return

        if (response.ok) {
          navigate('/dashboard', { replace: true })
          return
        }

        setAuthState(
          response.status === 503 ? 'not-configured' : 'ready',
        )
      })
      .catch(() => {
        if (active) setAuthState('unavailable')
      })

    return () => {
      active = false
    }
  }, [apiUrl, navigate])

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand" aria-label="Web GIS Enterprise">
          <span className="login-brand-mark" aria-hidden="true">GIS</span>
          <span>Web GIS Enterprise</span>
        </div>
        <div className="login-copy">
          <p className="login-eyebrow">Acceso seguro</p>
          <h1 id="login-title">Iniciar sesión</h1>
          <p>Accede con una cuenta habilitada para Web GIS.</p>
        </div>
        {searchParams.get('error') && (
          <p className="login-notice login-notice-error" role="alert">
            No se pudo completar el inicio de sesión. Inténtalo nuevamente.
          </p>
        )}
        {searchParams.get('logged_out') && (
          <p className="login-notice">
            La sesión se cerró correctamente.
          </p>
        )}
        {authState === 'not-configured' && (
          <p className="login-notice login-notice-error" role="alert">
            El proveedor OIDC todavía no está configurado en el backend.
          </p>
        )}
        {authState === 'unavailable' && (
          <p className="login-notice login-notice-error" role="alert">
            No se pudo conectar con el servicio de autenticación.
          </p>
        )}
        <button
          className="login-button"
          type="button"
          disabled={authState !== 'ready'}
          onClick={() => window.location.assign(`${apiUrl}/auth/login`)}
        >
          {authState === 'checking'
            ? 'Conectando con el servicio…'
            : 'Continuar con inicio de sesión'}
          {authState === 'ready' && <span aria-hidden="true">→</span>}
        </button>
        <p className="login-footnote">
          La autenticación se gestiona de forma segura por el proveedor de identidad.
        </p>
      </section>
    </main>
  )
}

export default LoginPage
