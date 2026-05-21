import {
  useEffect,
  useRef,
} from 'react'

import { useLayers } from '@/store/layers/hooks/useLayers'

import { operationalLayers } from '@/gis/layers/registry/operationalLayers'

import { LAYER_ACTIONS } from '@/store/layers/layerActions'//frontend\src\store\layers\layerActions.js

import MapView  from '@/gis/components/map/MapView'//frontend\src\gis\components\map\MapView.jsx

import LayerPanel from '@/gis/components/layers/LayerPanel'//frontend\src\gis\components\layers\LayerPanel.jsx

import {
  loadLayerState,
  saveLayerState,
} from '@/gis/services/persistence/layerPersistence'

function App() {
 const {
  state,
  dispatch,
} = useLayers()

 const hydrated =
  useRef(false)

useEffect(() => {

  const persistedLayers =
    loadLayerState()

  dispatch({
    type:
      LAYER_ACTIONS.SET_LAYERS,

    payload:
      persistedLayers ||
      operationalLayers,
  })

  hydrated.current =
    true

}, [dispatch])
 
 useEffect(() => {

  if (
    !hydrated.current
  ) {
    return
  }

  if (
    state.layers.length
  ) {
    saveLayerState(
      state.layers
    )
  }

}, [state.layers])

  return (
    <div className="app-layout">
      <LayerPanel />
      <h1>Web GIS Enterprise</h1>
      <MapView />
    </div>
  )
}

export default App