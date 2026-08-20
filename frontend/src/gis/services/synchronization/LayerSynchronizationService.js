import {
  OPERATION_TYPES,
} from '@/gis/services/persistence/constants/operationTypes'

import {
  REPOSITORY_TYPES,
} from '@/gis/services/persistence/constants/repositoryTypes'

import {
  ADAPTER_TYPES,
} from '@/gis/services/persistence/constants/adapterTypes'

import {
  synchronizationManager,
} from '@/gis/synchronization/SynchronizationManager'

export class LayerSynchronizationService {

  constructor() {

    this.successListeners = []
    this.failureListeners = []

    this.initialize()

  }

  initialize() {

    synchronizationManager.onOperationSuccess(
      result => {

        this.notifyLayerSynchronized(
          result
        )

      }
    )
  synchronizationManager.onOperationFailure(
    result => {

      this.notifyLayerSynchronizationFailed(
        result
      )

    }
  )
  }

onLayerSynchronized(listener) {

    this.successListeners.push(
        listener
    )

    return () => {

        this.successListeners =
            this.successListeners.filter(
                currentListener =>
                    currentListener !== listener
            )

    }

}

onLayerSynchronizationFailed(listener) {

  this.failureListeners.push(
    listener
  )

  return () => {

    this.failureListeners =
      this.failureListeners.filter(
        currentListener =>
          currentListener !== listener
      )

  }

}

  notifyLayerSynchronized(result) {

    this.successListeners.forEach(
      listener => {

        listener(result)

      }
    )

  }
  notifyLayerSynchronizationFailed(result) {

  this.failureListeners.forEach(
    listener => {

      listener(result)

    }
  )

}
  queueLayerUpdate(layer) {

    synchronizationManager
      .queueOperation({

        type:
          OPERATION_TYPES.UPDATE,

        repository:
          REPOSITORY_TYPES.LAYER,

        adapter:
          ADAPTER_TYPES.LOCAL,

        layerId:
          layer.id,

        payload:
          layer,

      })

    console.log(
      'LAYER UPDATE QUEUED:',
      layer.id
    )

  }

}

export const layerSynchronizationService =
  new LayerSynchronizationService()