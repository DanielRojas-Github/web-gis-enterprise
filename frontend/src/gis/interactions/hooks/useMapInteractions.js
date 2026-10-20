
import { useEffect, useRef } from 'react'
import { useMapEvents } from 'react-leaflet'
import { toolManager } from '@/gis/tools/manager/ToolManager'

const DOUBLE_CLICK_DELAY = 250

export const useMapInteractions = () => {
  const clickTimeoutRef = useRef(null)

  const map = useMapEvents({
    click(event) {
      const activeTool = toolManager.getActiveTool()

      if (!activeTool?.onMapClick) {
        return
      }

      // Point y otras herramientas procesan el clic inmediatamente.
      // Para DrawTool esperamos un momento para detectar un doble clic.
      if (activeTool.id !== 'draw') {
        activeTool.onMapClick(event)
        return
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }

      clickTimeoutRef.current = setTimeout(() => {
        const currentTool = toolManager.getActiveTool()

        if (currentTool?.id === 'draw' && currentTool.onMapClick) {
          currentTool.onMapClick(event)
        }

        clickTimeoutRef.current = null
      }, DOUBLE_CLICK_DELAY)
    },

    dblclick(event) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = null
      }

      const activeTool = toolManager.getActiveTool()

      if (activeTool?.id === 'draw' && activeTool.onDoubleClick) {
        activeTool.onDoubleClick(event)
      }
    },
  })

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [map])

  return null
}
