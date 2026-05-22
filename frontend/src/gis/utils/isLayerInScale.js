export const isLayerInScale =
  (
    layer,
    zoom
  ) => {

    if (
      !layer.scale
    ) {
      return true
    }

    return (
      zoom >=
        layer.scale.min &&

      zoom <=
        layer.scale.max
    )
  }