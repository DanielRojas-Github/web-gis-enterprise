export const removeNodeFromTree =
  (
    items,
    nodeId
  ) => {

    let removedNode =
      null

    const updatedTree =
      items
        .map((item) => {

          if (
            item.id ===
            nodeId
          ) {

            removedNode =
              item

            return null
          }

          if (
            item.type ===
            'group'
          ) {

            const result =
              removeNodeFromTree(
                item.children ||
                  [],

                nodeId
              )

            if (
              result.removedNode
            ) {
              removedNode =
                result.removedNode
            }

            return {
              ...item,

              children:
                result.tree,
            }
          }

          return item
        })
        .filter(Boolean)

    return {
      tree:
        updatedTree,

      removedNode,
    }
  }