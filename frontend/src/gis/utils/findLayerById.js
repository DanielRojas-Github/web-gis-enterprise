export const findLayerById = (
  items,
  targetId
) => {

  for (const item of items) {

    if (item.id === targetId) {
      return item
    }

    if (
      Array.isArray(item.children) &&
      item.children.length > 0
    ) {

      const found =
        findLayerById(
          item.children,
          targetId
        )

      if (found) {
        return found
      }
    }
  }

  return null
}