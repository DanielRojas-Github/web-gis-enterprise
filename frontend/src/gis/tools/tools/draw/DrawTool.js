
import { drawState }
from '@/gis/tools/overlays/draw/drawStore'



export const DrawTool = {

  id: 'draw',

  activate() {

  

    drawState.clear()
  },

  deactivate() {

   

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
 
  drawState.addFeature({

  id:
    crypto.randomUUID(),

  type:
    drawState.type,

  points: [
    ...drawState.points
  ],
})



  drawState.setFinished(
    true
  )

},

}