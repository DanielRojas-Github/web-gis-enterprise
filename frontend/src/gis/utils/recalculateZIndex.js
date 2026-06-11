export const recalculateZIndex = (
  layers
) => {

  let currentZIndex = 1

  const updateTree = (
    nodes
  ) => {

    return nodes.map(
      (node) => {

        if (
          node.children
        ) {

          return {
            ...node,

            children:
              updateTree(
                node.children
              ),
          }
        }

        return {
          ...node,

          zIndex:
            currentZIndex++,
        }
      }
    )
  }

  return updateTree(
    layers
  )
}