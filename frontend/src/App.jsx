import {
  useEffect,
  useRef,
} from 'react'

import { useLayers } from '@/store/layers/hooks/useLayers'

import { operationalLayers } from '@/gis/layers/registry/operationalLayers'

import { LAYER_ACTIONS } from '@/store/layers/layerActions'//frontend\src\store\layers\layerActions.js

import MapView  from '@/gis/components/map/MapView'//frontend\src\gis\components\map\MapView.jsx

import LayerPanel from '@/gis/components/layers/LayerPanel'

import {
  GIS_ACTIONS,
} from '@/store/gis/gisActions'

import {
  loadLayerState,
  saveLayerState,
} from '@/gis/services/persistence/layerPersistence'

import { useGIS }
  from '@/store/gis/hooks/useGIS'

import { mockSelectedFeature }
  from '@/gis/selection/mocks/mockSelectedFeature'

import SelectionControls
  from '@/gis/selection/components/SelectionControls'

function App() {
 const {
  state,
  dispatch,
} = useLayers()

 const hydrated =
  useRef(false)

const {
  dispatch: gisDispatch,
} = useGIS()

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

  gisDispatch({
    type:
      GIS_ACTIONS.SET_SELECTED_FEATURE,

    payload:
      mockSelectedFeature,
  })

}, [gisDispatch])
 
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
      <button
  onClick={() =>
    gisDispatch({
      type:
        GIS_ACTIONS.SET_FILTERS,

      payload: {
        category:
          'hydrology',
      },
    })
  }
>
  Hydrology
</button>

<button
  onClick={() =>
    gisDispatch({
      type:
        GIS_ACTIONS.SET_FILTERS,

      payload: {
        category:
          'transportation',
      },
    })
  }
>
  Transportation
</button>

<button
  onClick={() =>
    gisDispatch({
      type:
        GIS_ACTIONS.SET_FILTERS,

      payload: {},
    })
  }
>
  Reset Filters
</button>
      <SelectionControls />
      <MapView />
    </div>
  )
}

export default App
