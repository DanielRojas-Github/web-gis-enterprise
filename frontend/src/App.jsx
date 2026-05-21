import { useEffect } from 'react'

import { useLayers } from '@/store/layers/hooks/useLayers'

import { operationalLayers } from '@/gis/layers/registry/operationalLayers'

import { LAYER_ACTIONS } from '@/store/layers/layerActions'//frontend\src\store\layers\layerActions.js

import MapView  from '@/gis/components/map/MapView'//frontend\src\gis\components\map\MapView.jsx

import LayerPanel from '@/gis/components/layers/LayerPanel'//frontend\src\gis\components\layers\LayerPanel.jsx


function App() {
  const { dispatch } = useLayers() // Access the dispatch function from the layers context

  useEffect(() => {
    dispatch({
      type: LAYER_ACTIONS.SET_LAYERS,
      payload: operationalLayers,
    })
  }, [dispatch])

  return (
    <div className="app-layout">
      <LayerPanel />
      <h1>Web GIS Enterprise</h1>
      <MapView />
    </div>
  )
}

export default App