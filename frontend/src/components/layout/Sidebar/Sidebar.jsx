import { Link } from 'react-router-dom'
import { ROUTES } from '@constants/routes'

function Sidebar() {
  return (
    <aside>
      <h2>GIS Enterprise</h2>

      <nav>
        <ul>
          <li>
            <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
          </li>

          <li>
            <Link to={ROUTES.MAPS}>Maps</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar