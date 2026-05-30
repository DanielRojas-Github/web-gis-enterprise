import { useMapEvents } from 'react-leaflet'

import { toolManager } from '@/gis/tools/manager/ToolManager'

export default function MapEventHandler() {
  useMapEvents({
    // click(event) {
    //   const activeTool = toolManager.getActiveTool()

    //   activeTool?.onMapClick?.(event)
    // },
    click(event) {

  const activeTool =
    toolManager.getActiveTool()

  console.log('ACTIVE TOOL:', activeTool)

  activeTool?.onMapClick?.(event)
},
    mousemove(event) {
      const activeTool = toolManager.getActiveTool()

      activeTool?.onMouseMove?.(event)
    },
  })

  return null
}