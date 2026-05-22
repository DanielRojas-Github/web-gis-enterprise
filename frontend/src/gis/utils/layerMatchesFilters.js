export const layerMatchesFilters =
  (
    layer,
    filters
  ) => {

    if (
      !filters ||
      Object.keys(filters)
        .length === 0
    ) {
      return true
    }

    if (
      filters.category &&
      layer.metadata?.category !==
        filters.category
    ) {
      return false
    }

    return true
  }