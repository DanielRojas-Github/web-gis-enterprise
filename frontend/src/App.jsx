import {
  useEffect,
  useRef,
} from 'react'

import { useLayers } from '@/store/layers/hooks/useLayers'

import { operationalLayers } from '@/gis/layers/registry/operationalLayers'


import { LAYER_ACTIONS } from '@/store/layers/layerActions'

import MapView from '@/gis/components/map/MapView'

import LayerPanel from '@/gis/components/layers/LayerPanel'


import {
  loadLayerState,
  saveLayerState,
} from '@/gis/services/persistence/layerPersistence'



import SelectionControls
  from '@/gis/selection/components/SelectionControls'

import CoordinateInspector
  from '@/gis/components/status/CoordinateInspector'

import ToolBar
  from '@/gis/tools/components/ToolBar'

import { toolManager } from '@/gis/tools/manager/ToolManager'

import {
  baseLayers,
}
  from '@/gis/layers/registry/baseLayers'

import FeatureInspector
  from '@/gis/selection/components/FeatureInspector'

import {
  GIS_ACTIONS,
}
from '@/store/gis/gisActions'  

import {
  useGIS,
}
from '@/store/gis/hooks/useGIS'


window.toolManager = toolManager

const initialLayers = [

  ...baseLayers,

  ...operationalLayers,
]
function App() {


  const {
    layers,
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
        initialLayers,
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

    if (layers.length
    ) {
      saveLayerState(
        layers
      )
    }

  }, [layers])



  return (
    <div className="app-layout">
      <LayerPanel />
      <h1>Web GIS Enterprise</h1>

      <SelectionControls />
      <FeatureInspector />
      <ToolBar />
      <MapView />
      <CoordinateInspector />
    </div>
  )
}

export default App
