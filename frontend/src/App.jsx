import {
  useEffect,
  
} from 'react'

import { useLayers } from '@/store/layers/hooks/useLayers'

import { operationalLayers } from '@/gis/layers/registry/operationalLayers'


import { LAYER_ACTIONS } from '@/store/layers/layerActions'

import MapView from '@/gis/components/map/MapView'

import LayerPanel from '@/gis/components/layers/LayerPanel'

import {
  loadLayerState,
 
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

// import {
//   GIS_ACTIONS
// }
// from '@/store/gis/gisActions'  

// import {
//   useGIS,
// }
// from '@/store/gis/hooks/useGIS'

import EditingPanel
  from '@/gis/selection/components/EditingPanel'

import GISSystemManager
  from '@/gis/system/GISSytemManager'


window.toolManager = toolManager

const initialLayers = [

  ...baseLayers,

  ...operationalLayers,
]
function App() {


  const {
  
    dispatch,
  } = useLayers()


 

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

    

  }, [dispatch])


  



  return (
    <div className="app-layout">
      <GISSystemManager />
      
      <LayerPanel />
      <h1>Web GIS Enterprise</h1>

      <SelectionControls />
      <FeatureInspector />
      <ToolBar />
      <EditingPanel />
      <MapView />
      <CoordinateInspector />
    </div>
  )
}

export default App
