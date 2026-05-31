import { useGIS }
  from '@/store/gis/hooks/useGIS'

import {
  GIS_ACTIONS,
} from '@/store/gis/gisActions'

import {
  TOOL_TYPES,
} from '@/gis/tools/toolTypes'

import { toolManager }
  from '@/gis/tools/manager/ToolManager'




const ToolBar = () => { 

  const {
    state,
    dispatch,
  } = useGIS()

 const setTool = (tool) => {
  console.log('SELECTING TOOL:', tool)
  toolManager.activate(tool)

  dispatch({
    type:
      GIS_ACTIONS.SET_ACTIVE_TOOL,

    payload:
      tool,
  })

  dispatch({
    type:
      GIS_ACTIONS.SET_SELECTED_FEATURE,

    payload:
      null,
  })

  dispatch({
    type:
      GIS_ACTIONS.SET_FEATURE_INFO,

    payload:
      null,
  })
}
  const clearMeasurements = () => { dispatch({ type: GIS_ACTIONS.CLEAR_MEASUREMENTS, }) }
  return (
    <div
      style={{
        position: 'absolute',

        top: 20,
        right: 20,

        zIndex: 9999,

        display: 'flex',

        gap: '10px',

        background: '#FFFFFF',

        padding: '10px',

        borderRadius: '8px',

        boxShadow:
          '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >

      <button
        onClick={() =>
          setTool(
            TOOL_TYPES.IDENTIFY
          )
        }
      >
        Identify
      </button>

      <button
        onClick={() =>
          setTool(
            TOOL_TYPES.MEASURE
          )
        }
      >
        Measure
      </button>

      <button
        onClick={() =>
          setTool(
            TOOL_TYPES.DRAW
          )
        }
      >
        Draw
      </button>
      <button
  onClick={
    clearMeasurements
  }
>
  Clear Measure
</button>

      <div>

        Active:
        {' '}
        {state?.activeTool || 'NONE'}

      </div>

    </div>
  )
}

export default ToolBar