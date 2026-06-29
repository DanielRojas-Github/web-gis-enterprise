export const updateLayerTree = (items, targetId, updater) => {
  return items.map(item => {

    // 1. match directo
    if (item.id === targetId) {
      return updater(item)
    }

    // 2. recurse ONLY if children exist AND is array
    if (Array.isArray(item.children) && item.children.length > 0) {
      return {
        ...item,
        children: updateLayerTree(
          item.children,
          targetId,
          updater
        ),
      }
    }

    return item
  })
}