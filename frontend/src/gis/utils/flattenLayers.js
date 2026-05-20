export const flattenLayers = (groups) => {
  const result = []

  groups.forEach((group) => {
    if (!group.children) return

    group.children.forEach((layer) => {
      if (layer.visible) {
        result.push(layer)
      }
    })
  })

  return result
}
