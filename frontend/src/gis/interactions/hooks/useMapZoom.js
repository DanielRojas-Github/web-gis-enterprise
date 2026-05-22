import { useMapEvents }
  from 'react-leaflet'

import { useGIS }
  from '@/store/gis/hooks/useGIS'

import { GIS_ACTIONS }
  from '@/store/gis/gisActions'

export const useMapZoom =
  () => {

    const { dispatch } =
      useGIS()

    useMapEvents({

      zoomend: (
        event
      ) => {

        const zoom =
          event.target.getZoom()

        dispatch({
          type:
            GIS_ACTIONS
              .SET_ZOOM,

          payload:
            zoom,
        })
      },
    })
  }