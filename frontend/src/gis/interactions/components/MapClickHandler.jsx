import {
  useMapEvents,
} from 'react-leaflet'

import { useGIS }
  from '@/store/gis/hooks/useGIS'

import {
  GIS_ACTIONS,
} from '@/store/gis/gisActions'

import {
  mockIdentifyFeature,
} from '@/gis/selection/utils/mockIdentifyFeature'

import {
  TOOL_TYPES,
} from '@/gis/tools/toolTypes'

const MapClickHandler = () => {

  const {
    state,
    dispatch,
  } = useGIS()

  useMapEvents({

    click(event) {

      const {
        lat,
        lng,
      } = event.latlng

      // =====================
      // MEASURE TOOL
      // =====================

      if (
        state.activeTool ===
        TOOL_TYPES.MEASURE
      ) {

        dispatch({
          type:
            GIS_ACTIONS.ADD_MEASUREMENT_POINT,

          payload: [
            lat,
            lng,
          ],
        })

        if (state.measurements.length > 1) {
          dispatch({
            type:
              GIS_ACTIONS.UPDATE_MEASUREMENT_DISTANCE,
          })
        }

        return
      }

      // =====================
      // IDENTIFY TOOL
      // =====================

      if (
        state.activeTool !==
        TOOL_TYPES.IDENTIFY
      ) {
        return
      }

      const feature =
        mockIdentifyFeature()

      dispatch({
        type:
          GIS_ACTIONS.SET_FEATURE_INFO,

        payload: {
          lat,
          lng,
        },
      })

      dispatch({
        type:
          GIS_ACTIONS.SET_SELECTED_FEATURE,

        payload:
          feature,
      })

    },
  })

  return null
}

export default MapClickHandler