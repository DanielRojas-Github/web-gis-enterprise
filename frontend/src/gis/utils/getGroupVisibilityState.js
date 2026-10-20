export const getGroupVisibilityState =
  (group) => {

    const visibility = []

    const collectVisibility =
      (items) => {

        items.forEach(
          (item) => {

            if (
              item.type ===
              'group'
            ) {

              collectVisibility(
                item.children || []
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

    if (
      visibility.length === 0
    ) {

      return {
        checked:
          Boolean(
            group.visible
          ),

        indeterminate:
          false,
      }
    }

    const allVisible =
      visibility.every(
        Boolean
      )

    const noneVisible =
      visibility.every(
        (visible) =>
          !visible
      )

    const mixedVisibility =
      !allVisible &&
      !noneVisible

    return {
      checked:
        Boolean(
          group.visible
        ),

      indeterminate:
        Boolean(
          group.visible
        ) &&
        mixedVisibility,
    }
  }