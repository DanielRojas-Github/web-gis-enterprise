import { useMapEvents } from 'react-leaflet'

import { useGIS } from '@/store/gis/hooks/useGIS'

import { GIS_ACTIONS } from '@/store/gis/gisActions'

export const useMapInteractions = () => {
  const { dispatch } = useGIS()

  useMapEvents({
    click(event) {
      const { latlng } = event

      dispatch({
        type: GIS_ACTIONS.SET_SELECTED_FEATURE,

        payload: {
          coordinates: latlng,
        },
      })

      console.log('Map clicked:', latlng)
    },
  })

  return null
}