import {
  createSyncOperation,
} from './models/syncOperation'

import {
  syncQueue,
} from './syncQueue'

import {
  OPERATION_TYPES,
} from './constants/operationTypes'

import {
  REPOSITORY_TYPES,
} from './constants/repositoryTypes'

export function saveDirtyLayers(
  layers = []
) {

  for (const layer of layers) {

    const operation =
      createSyncOperation({

        type:
          OPERATION_TYPES.UPDATE,

        repository:
          REPOSITORY_TYPES.LAYER,

        layerId:
          layer.id,

        payload:
          layer,

      })

    syncQueue.enqueue(
      operation
    )

  }

}