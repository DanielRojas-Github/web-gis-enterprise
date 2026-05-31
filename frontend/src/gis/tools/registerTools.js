import { toolRegistry }
from '@/gis/tools/manager/ToolRegistry'

import { MeasureTool }
from './tools/measure/MeasureTool'

import { IdentifyTool }
from './tools/identify/IdentifyTool'

import { DrawTool }
from './tools/draw/DrawTool'

export const registerTools = () => {

  toolRegistry.register(MeasureTool)

  toolRegistry.register(IdentifyTool)

  toolRegistry.register(DrawTool)

  console.log(
    'REGISTERED TOOLS:',
    toolRegistry.getAll()
  )
}