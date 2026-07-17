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
} from '@/gis/services/persistence/models/syncOperation'

import {
  syncQueue,
} from '@/gis/services/persistence/syncQueue'

import {
  OPERATION_TYPES,
} from '@/gis/services/persistence/constants/operationTypes'

import {
  REPOSITORY_TYPES,
} from '@/gis/services/persistence/constants/repositoryTypes'

export const useAutosave = () => {
  const {
    layers, setLayerSaving

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
          // 
          const operation =
            createSyncOperation({
              repository: REPOSITORY_TYPES.LAYER,
              type: OPERATION_TYPES.UPDATE,



              layerId: layer.id,



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