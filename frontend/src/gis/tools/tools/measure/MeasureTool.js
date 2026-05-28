import { measureState }
from '@/gis/tools/overlays/measure/measureStore'

export const MeasureTool = {
  id: 'measure',

  activate() {
    console.log('Measure enabled')

    measureState.setPoints([])
  },

  deactivate() {
    console.log('Measure disabled')

    measureState.setPoints([])
  },

  onMapClick(event) {

    console.log('CLICK DETECTED')

    measureState.setPoints([
      ...measureState.points,
      event.latlng,
    ])

    console.log(measureState.points)
  },
}