import { useGIS }
  from '@/store/gis/hooks/useGIS'

import { drawState }
  from '@/gis/tools/overlays/draw/drawStore'

import { GIS_ACTIONS }
  from '@/store/gis/gisActions'

export default function SelectionRenderer() {
  const {
    state,
    dispatch,
  }
    =
    useGIS()


  const feature =
    state.selectedFeature

  if (!feature) {
    return null
  }
  console.log(
    'Selected Feature:',
    feature
  )
  const vertexCount =
    feature.points?.length ?? 0

  const handleDelete =
    () => {

      drawState.removeFeature(
        feature.id
      )

      dispatch({
        type:
          GIS_ACTIONS
            .SET_SELECTED_FEATURE,

        payload: null,
      })
    }
  const handleEdit =
    () => {

      dispatch({

        type:
          GIS_ACTIONS
            .SET_EDITING,

        payload: true,
      })
      dispatch({

        type:
          GIS_ACTIONS
            .SET_EDITING_FEATURE,
        payload: feature,
      })
    }
  const handleStopEditing =
    () => {

      dispatch({

        type:
          GIS_ACTIONS
            .SET_EDITING,

        payload: false,
      })

      dispatch({

        type:
          GIS_ACTIONS
            .SET_EDITING_FEATURE,

        payload: null,
      })
    }

  return (

    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,

        background: 'white',

        padding: '12px',

        borderRadius: '8px',

        boxShadow:
          '0 2px 10px rgba(0,0,0,.2)',

        minWidth: '250px',
      }}
    >

      <h4>
        Feature Seleccionada
      </h4>

      <p>
        <strong>ID:</strong>
        {' '}
        {feature.id}
      </p>

      <p>
        <strong>Tipo:</strong>
        {' '}
        {feature.type}
      </p>

      <p>
        <strong>Vértices:</strong>
        {' '}
        {vertexCount}
      </p>
      <button
        onClick={handleDelete}
      >
        Eliminar
      </button>

      <button
        onClick={handleEdit}
      >
        Editar
      </button>
      <button
        onClick={handleStopEditing}
      >
        Finalizar edición
      </button>

    </div>
  )
}