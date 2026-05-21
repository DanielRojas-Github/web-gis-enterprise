export const updateLayerTree =
  (
    items,
    layerId,
    updater
  ) => {

    return items.map(
      (item) => {

        if (
          item.type ===
          'group'
        ) {

          return {
            ...item,

            children:
              updateLayerTree(
                item.children ||
                  [],

                layerId,

                updater
              ),
          }
        }

        if (
          item.id === layerId
        ) {
          return updater(item)
        }

        return item
      }
    )
  }