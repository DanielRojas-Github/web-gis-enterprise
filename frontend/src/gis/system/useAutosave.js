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

import {
  createSyncOperation,
} from '@/gis/services/persistence/syncOperation'

import {
  syncQueue,
} from '@/gis/services/persistence/syncQueue'

export const useAutosave = () => {
  const {
    layers,setLayerSaving

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


    if (!state.autosave) {

      return
    }


    const interval =
      setInterval(async () => {
        console.log(
          '=========================='
        )

        const currentLayers =
          layersRef.current



        const flatLayers =
          flattenLayers(
            currentLayers
          )



        const dirtyLayers =
          flatLayers.filter(
            layer =>
              layer.dirty &&
              !layer.saving
          )

        if (
          dirtyLayers.length ===
          0
        ) {

          return
        }

        for (const layer of dirtyLayers) {

          console.log(
            'CREATING SYNC OPERATION:',
            layer.id
          )

          const operation =
            createSyncOperation({

              type: 'UPDATE',

              layerId: layer.id,

              featureId: null,

              payload: layer,

            })

          syncQueue.enqueue(operation)
          setLayerSaving(
  layer.id,
  true
)

          console.log(
            'SYNC OPERATION ENQUEUED:',
            operation.id
          )

        }
      },
        state.autosaveInterval
      )

    return () => {


      clearInterval(
        interval
      )
    }
  }, [

    state.autosave,
    state.autosaveInterval,
  ])
}