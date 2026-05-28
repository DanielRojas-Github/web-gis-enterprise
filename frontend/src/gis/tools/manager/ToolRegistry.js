class ToolRegistry { // Manages the registration and retrieval of GIS tools
  constructor() {
    this.tools = new Map()
  }
   
  register(tool) {
  
    this.tools.set(tool.id, tool)
  }

  get(toolId) {
    
    return this.tools.get(toolId)
  }

  getAll() {
    return Array.from(this.tools.values())
  }
}

export const toolRegistry = new ToolRegistry()