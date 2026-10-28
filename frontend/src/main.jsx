import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'leaflet/dist/leaflet.css'

import '@styles/globals.css'
import '@styles/layout.css'
import '@styles/map.css'

import GISProvider from '@/store/gis/GISProvider'
import LayerProvider from '@/store/layers/LayerProvider'

import { bootstrapGIS } from '@/gis/bootstrap/bootstrapGIS'

import AppRouter from './app/router/AppRouter'

bootstrapGIS()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GISProvider>
      <LayerProvider>
        <AppRouter />
      </LayerProvider>
    </GISProvider>
  </StrictMode>
)
