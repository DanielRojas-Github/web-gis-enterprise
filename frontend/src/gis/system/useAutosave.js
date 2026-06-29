import {
  useEffect,
  useRef,
} from 'react'

import {
  useLayers,
} from '@/store/layers/hooks/useLayers'

import {
  useGIS,
} from '@/store/gis/hooks/useGIS'

import {
  flattenLayers,
} from '@/gis/utils/flattenLayers'

export const useAutosave = () => {
  const {
    layers,
    saveLayer,
  } = useLayers()

  const {
    state,
  } = useGIS()

  const layersRef =
    useRef(layers)

  // Mantener siempre la última versión de las capas
  useEffect(() => {
    layersRef.current =
      layers
  }, [layers])

  useEffect(() => {
    console.log(
      'AUTOSAVE EFFECT STARTED'
    )

    if (!state.autosave) {
      console.log(
        'AUTOSAVE DISABLED'
      )
      return
    }

    console.log(
      'CREATING AUTOSAVE INTERVAL:',
      state.autosaveInterval
    )

    const interval =
      setInterval(async () => {
        console.log(
          '=========================='
        )
        console.log(
          'CHECKING DIRTY LAYERS'
        )

        const currentLayers =
          layersRef.current

        console.log(
          'ROOT LAYERS:',
          currentLayers
        )

        const flatLayers =
          flattenLayers(
            currentLayers
          )

        console.log(
          'FLAT LAYERS FULL:',
          flatLayers.map(
            layer => ({
              id: layer.id,
              dirty:
                layer.dirty,
              saving:
                layer.saving,
              lastSaved:
                layer.lastSaved,
            })
          )
        )

        const dirtyLayers =
          flatLayers.filter(
            layer =>
              layer.dirty &&
              !layer.saving
          )

        console.log(
          'DIRTY LAYERS:',
          dirtyLayers.map(
            layer => ({
              id: layer.id,
              dirty:
                layer.dirty,
            })
          )
        )

        if (
          dirtyLayers.length ===
          0
        ) {
          console.log(
            'NO DIRTY LAYERS'
          )
          return
        }

        console.log(
          'AUTOSAVE TRIGGER:',
          dirtyLayers.map(
            l => l.id
          )
        )

        for (const layer of dirtyLayers) {
          try {
            console.log(
              'SAVING LAYER:',
              layer.id
            )

            await saveLayer(
              layer.id
            )

            console.log(
              'LAYER SAVED:',
              layer.id
            )
          } catch (error) {
            console.error(
              'AUTOSAVE ERROR:',
              layer.id,
              error
            )
          }
        }
      },
      state.autosaveInterval
    )

    return () => {
      console.log(
        'CLEARING AUTOSAVE INTERVAL'
      )

      clearInterval(
        interval
      )
    }
  }, [
    saveLayer,
    state.autosave,
    state.autosaveInterval,
  ])
}