export const getGroupVisibilityState =
  (group) => {

    const visibility =
      []

    const collectVisibility =
      (items) => {

        items.forEach(
          (item) => {

            if (
              item.type ===
              'group'
            ) {

              collectVisibility(
                item.children ||
                  []
              )

            } else {

              visibility.push(
                item.visible
              )
            }
          }
        )
      }

    collectVisibility(
      group.children || []
    )

    const allVisible =
      visibility.every(
        Boolean
      )

    const noneVisible =
      visibility.every(
        (v) => !v
      )

    return {
      checked:
        allVisible,

      indeterminate:
        !allVisible &&
        !noneVisible,
    }
  }