import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import '@styles/globals.css'
import '@styles/layout.css'
import '@styles/map.css'
import   GISProvider  from '@/store/gis/GISProvider'
import  LayerProvider  from '@/store/layers/LayerProvider'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GISProvider>
      <LayerProvider>
        <App />
      </LayerProvider>
    </GISProvider>
  </StrictMode>
)
