export const flattenLayers = (
  layers
) => {
  const result = []

  const traverse = (
    items
  ) => {
    items.forEach((item) => {
      if (
        item.type === 'group'
      ) {
        traverse(
          item.children || []
        )
      } else {
        result.push(item)
      }
    })
  }

  traverse(layers)

  return result
}