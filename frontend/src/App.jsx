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

import {
  mergeLayerTrees,
} from '@/gis/utils/mergeLayerTrees'

import EditingPanel
  from '@/gis/selection/components/EditingPanel'

import PublicFacilityEditor
  from '@/gis/components/municipal/PublicFacilityEditor'

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
        persistedLayers
          ? mergeLayerTrees(
            persistedLayers,
            initialLayers
          )
          : initialLayers,
    })



  }, [dispatch])






  return (
    <div className="app-layout">
      <LayerPanel />
      <section className="gis-workspace">
        <h1 className="gis-workspace-heading">Web GIS Enterprise</h1>
        <div className="gis-workspace-tools">
          <SelectionControls />
          <FeatureInspector />
          <EditingPanel />
          <PublicFacilityEditor />
        </div>
        <div className="gis-map-area">
          <ToolBar />
          <MapView />
          <CoordinateInspector />
        </div>
      </section>
    </div>
  )
}

export default App
