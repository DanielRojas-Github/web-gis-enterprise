import { useEffect } from 'react'

import { useLayers } from '@/store/layers/hooks/useLayers'

import { operationalLayers } from '@/gis/layers/registry/operationalLayers'

import { LAYER_ACTIONS } from '@/store/layers/layerActions'

import MapView  from '@/components/map/MapView/MapView'

import LayerPanel from '@/components/map/LayerPanel/LayerPanel'


function App() {
  const { dispatch } = useLayers()

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