
import { drawState } from '@/gis/tools/overlays/draw/drawStore'
import { DRAW_TYPES } from './drawTypes'

const createFeature = (type, points) => ({
  id: crypto.randomUUID(),
  type,
  points: [...points],
})

const resetDrawing = () => {
  drawState.setPoints([])
  drawState.setFinished(false)
}

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

    // Los puntos se guardan con un solo clic.
    if (drawState.type === DRAW_TYPES.POINT) {
      drawState.addFeature(
        createFeature(DRAW_TYPES.POINT, [event.latlng])
      )

      resetDrawing()
      return
    }

    // Líneas y polígonos acumulan vértices provisionalmente.
    drawState.setPoints([
      ...drawState.points,
      event.latlng,
    ])
  },

  onDoubleClick(event) {
    if (drawState.finished) {
      return
    }

    // Un doble clic sobre la herramienta Point genera un solo punto.
    if (drawState.type === DRAW_TYPES.POINT) {
      drawState.addFeature(
        createFeature(DRAW_TYPES.POINT, [event.latlng])
      )

      resetDrawing()
      return
    }

    const points = [...drawState.points]
    const lastPoint = points[points.length - 1]

    // Incorpora el extremo del doble clic sin duplicar
    // un vértice que ya esté prácticamente en la misma posición.
    if (
      !lastPoint ||
      lastPoint.distanceTo(event.latlng) > 0.5
    ) {
      points.push(event.latlng)
    }

    const minimumPoints =
      drawState.type === DRAW_TYPES.POLYGON ? 3 : 2

    if (points.length < minimumPoints) {
      // Conserva el dibujo provisional para poder continuar.
      drawState.setPoints(points)
      return
    }

    drawState.addFeature(
      createFeature(drawState.type, points)
    )

    resetDrawing()
  },
}
