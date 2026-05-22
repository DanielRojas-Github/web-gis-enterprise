export const canUserAccessLayer =
  (
    layer,
    userRole
  ) => {

    if (
      !layer.permissions
    ) {
      return true
    }

    return (
      layer.permissions.includes(
        userRole
      )
    )
  }