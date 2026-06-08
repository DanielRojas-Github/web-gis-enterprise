
import { drawState }
from '@/gis/tools/overlays/draw/drawStore'

console.log(
  'DRAWTOOL USA DRAWSTORE',
  drawState
)

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
   if (drawState.finished) {

  return
}
    drawState.setPoints([
      ...drawState.points,
      event.latlng,
    ])

  
  },
  onDoubleClick() {
   console.log(
    'DOBLE CLICK DETECTADO'
  )
  drawState.addFeature({

  id:
    crypto.randomUUID(),

  type:
    drawState.type,

  points: [
    ...drawState.points
  ],
})
 console.log(
  drawState.features
)


  drawState.setFinished(
    true
  )

},

}