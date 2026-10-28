export const mergeLayerTrees = (
  persistedNodes = [],
  defaultNodes = []
) => {
  const defaultById = new Map(
    defaultNodes.map((node) => [node.id, node])
  )
  const persistedIds = new Set(
    persistedNodes.map((node) => node.id)
  )

  const mergedPersistedNodes = persistedNodes.map((persistedNode) => {
    const defaultNode = defaultById.get(persistedNode.id)

    if (!defaultNode) {
      return persistedNode
    }

    return {
      ...defaultNode,
      ...persistedNode,
      children: defaultNode.children || persistedNode.children
        ? mergeLayerTrees(
          persistedNode.children || [],
          defaultNode.children || []
        )
        : persistedNode.children,
    }
  })

  return [
    ...mergedPersistedNodes,
    ...defaultNodes.filter((node) => !persistedIds.has(node.id)),
  ]
}
