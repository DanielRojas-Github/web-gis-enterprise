import { useEffect } from 'react'

import {
  useLayers,
} from '@/store/layers/hooks/useLayers'

import {
  layerSynchronizationService,
} from '@/gis/services/synchronization/LayerSynchronizationService'

export const useLayerSynchronization = () => {

  const {
    clearLayerDirty,
    setLayerSyncError,
  } = useLayers()

useEffect(() => {

  const unsubscribeSuccess =
    layerSynchronizationService
      .onLayerSynchronized(
        result => {

          if (
            !result?.layerId
          ) {
            return
          }

          console.log(
            'LAYER SYNCHRONIZED:',
            result.layerId
          )

          clearLayerDirty(
            result.layerId
          )

        }
      )

  const unsubscribeFailure =
    layerSynchronizationService
      .onLayerSynchronizationFailed(
        result => {

          if (
            !result?.layerId
          ) {
            return
          }

          console.error(
            'LAYER SYNCHRONIZATION FAILED:',
            result.layerId,
            result.error
          )

          setLayerSyncError(
            result.layerId,
            result.error
          )

        }
      )

  return () => {

    unsubscribeSuccess()
    unsubscribeFailure()

  }

}, [
  clearLayerDirty,
  setLayerSyncError,
])

}