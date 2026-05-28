import { toolRegistry } from './ToolRegistry'

class ToolManager {
  constructor() {
    this.activeTool = null
  }

  activate(toolId) {
    const tool = toolRegistry.get(toolId)

    if (!tool) {
      console.warn(`Tool ${toolId} not found`)
      return
    }

    if (this.activeTool?.deactivate) {
      this.activeTool.deactivate()
    }

    this.activeTool = tool

    if (tool.activate) {
      tool.activate()
    }
  }

  deactivateCurrent() {
    if (this.activeTool?.deactivate) {
      this.activeTool.deactivate()
    }

    this.activeTool = null
  }

  getActiveTool() {
    return this.activeTool
  }
}

export const toolManager = new ToolManager()