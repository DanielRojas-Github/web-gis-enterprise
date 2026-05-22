export const updateLayerTree =
  (
    items,
    targetId,
    updater
  ) => {

    return items.map(
      (item) => {

        if (
          item.id ===
          targetId
        ) {
          return updater(item)
        }

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

                targetId,

                updater
              ),
          }
        }

        return item
      }
    )
  }