const STORAGE_KEY =
  'gis-layer-state'

export const saveLayerState =
  (layers) => {

    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify(
        layers
      )
    )
  }

export const loadLayerState =
  () => {

    const storedLayers =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (!storedLayers) {
      return null
    }

    return JSON.parse(
      storedLayers
    )
  }