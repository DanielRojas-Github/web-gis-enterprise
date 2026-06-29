const STORAGE_KEY =
  'gis-layer-state'
const STORAGE_VERSION =
  1

export const saveLayerState =
  (layers) => {

    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify(
        {
          version: STORAGE_VERSION,
          layers,
        }
      )
    )
  }
   

export const loadLayerState =
  () => {

    const storedState =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (!storedState) {
      return null
    }

    try {

      const parsedState =
        JSON.parse(
          storedState
        )

      if (
        parsedState.version !==
        STORAGE_VERSION
      ) {

   
        return null
      }

      return parsedState.layers

    } catch (error) {

      console.error(
        'Error loading layer state:',
        error
      )

      return null
    }
  }

  export const clearLayerState =
  () => {

    localStorage.removeItem(
      STORAGE_KEY
    )
  }