export const flattenLayers =
  (layers) => {

    const result = []

    const traverse =
      (items) => {

        items.forEach(
          (item) => {

            if (
              item.type ===
              'group'
            ) {

              if (
                item.visible
              ) {
                traverse(
                  item.children ||
                    []
                )
              }

            } else {

              if (
                item.visible
              ) {
                result.push(
                  item
                )
              }

            }
          }
        )
      }

    traverse(layers)

    return result
  }