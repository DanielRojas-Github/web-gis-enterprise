console.log('DrawTool.js loaded')
import { drawState }
from '@/gis/tools/overlays/draw/drawStore'//frontend\src\gis\tools\overlays\draw\drawStore.js

export const DrawTool = {

  id: 'draw',

  activate() {

    console.log('Draw enabled')

    drawState.clear()
  },

  deactivate() {

    console.log('Draw disabled')

    drawState.clear()
  },

  onMapClick(event) {

    drawState.setPoints([
      ...drawState.points,
      event.latlng,
    ])

    console.log(
      'DRAW POINTS:',
      drawState.points
    )
  },
}