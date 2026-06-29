// import {
//   CircleMarker,
// } from 'react-leaflet'

import { useGIS }
  from '@/store/gis/hooks/useGIS'

import { drawState }
  from './drawStore'

import { GIS_ACTIONS }
  from '@/store/gis/gisActions'

import {
  Marker,
} from 'react-leaflet'

import {
  findNearestVertex,
}
  from '@/gis/editing/utils/snapping'

import {
  editHistoryStore,
}
  from '@/gis/editing/history/editHistoryStore'

export default function
  EditVerticesOverlay() {

  const {
    state,
    dispatch,
  }
    =
    useGIS()

  const feature =
    state.editingFeature
  if (
    !state.isEditing ||
    !feature
  ) {
    return null
  }
  if (!feature.points) {
  return null
}
  const handleVertexMove =
    (
      vertexIndex,
      newPosition
    ) => {

      const snapCandidates =
        drawState.features.filter(
          item =>
            item.id !== feature.id
        )

      const snappedPoint =

        findNearestVertex(

          newPosition,
          snapCandidates


        )



      const finalPosition =

        snappedPoint ??
        newPosition

      const updatedFeature = {

        ...feature,

        points:
          feature.points.map(
            (point, index) =>
              index === vertexIndex
                ? finalPosition
                : point
          ),
      }

      editHistoryStore.saveSnapshot(
        drawState.features
      )
     console.log(
  'History:',
  editHistoryStore.history.length
)


      drawState.updateFeature(
        updatedFeature
      )

      dispatch({

        type:
          GIS_ACTIONS
            .SET_EDITING_FEATURE,

        payload:
          updatedFeature,
      })

      dispatch({

        type:
          GIS_ACTIONS
            .SET_SELECTED_FEATURE,

        payload:
          updatedFeature,
      })
    }

  const handleVertexDelete =
    vertexIndex => {

      let updatedPoints =
        feature.points.filter(
          (_, index) =>
            index !== vertexIndex
        )

      // Polygon mínimo 3 vértices
      if (
        feature.type === 'polygon' &&
        updatedPoints.length < 3
      ) {
        return
      }

      // Polyline mínimo 2 vértices
      if (
        feature.type === 'polyline' &&
        updatedPoints.length < 2
      ) {
        return
      }

      const updatedFeature = {

        ...feature,

        points: updatedPoints,
      }

      editHistoryStore
        .saveSnapshot(
          drawState.features
        )
      console.log(
        editHistoryStore.history
      )

      drawState.updateFeature(
        updatedFeature
      )

      dispatch({
        type:
          GIS_ACTIONS
            .SET_EDITING_FEATURE,

        payload:
          updatedFeature,
      })

      dispatch({
        type:
          GIS_ACTIONS
            .SET_SELECTED_FEATURE,

        payload:
          updatedFeature,
      })

    }

    if (!feature.points) {
  console.warn(
    'Feature sin points:',
    feature
  )

  return null
}

  return (
    <>
      {feature.points.map(
        (point, index) => (

          <Marker
            key={index}

            position={point}

            draggable={true}

            eventHandlers={{
              dragend: event => {

                handleVertexMove(
                  index,
                  event.target.getLatLng()
                )
              },
              dblclick: () => {

                handleVertexDelete(
                  index
                )
              },
            }}
          />
        )
      )}
    </>
  )
}