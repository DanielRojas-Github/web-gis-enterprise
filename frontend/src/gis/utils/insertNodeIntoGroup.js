export const insertNodeIntoGroup =
  (
    items,
    targetGroupId,
    node
  ) => {

    return items.map(
      (item) => {

        if (
          item.id ===
          targetGroupId
        ) {

          return {
            ...item,

            children: [
              ...item.children,

              node,
            ],
          }
        }

        if (
          item.type ===
          'group'
        ) {

          return {
            ...item,

            children:
              insertNodeIntoGroup(
                item.children ||
                  [],

                targetGroupId,

                node
              ),
          }
        }

        return item
      }
    )
  }