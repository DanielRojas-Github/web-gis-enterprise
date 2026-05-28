import { toolRegistry } from '@/gis/tools/manager/ToolRegistry'

import { MeasureTool } from './tools/measure/MeasureTool'

import { IdentifyTool } from './tools/identify/IdentifyTool'

export const registerTools = () => { // Registers all available GIS tools in the tool registry
  toolRegistry.register(MeasureTool)

  toolRegistry.register(IdentifyTool)

}