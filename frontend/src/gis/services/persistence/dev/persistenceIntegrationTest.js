import {
  createSyncOperation,
} from '@/gis/services/persistence/models/SyncOperation'

import {
  OPERATION_TYPES,
} from '../constants/operationTypes'

import {
  REPOSITORY_TYPES,
} from '../constants/repositoryTypes'

import {
  ADAPTER_TYPES,
} from '../constants/adapterTypes'

import {
  syncQueue,
} from '../syncQueue'

import {
  synchronizationManager,
} from '@/gis/synchronization/SynchronizationManager'

export function persistenceIntegrationTest() {

  console.group(
    'PERSISTENCE INTEGRATION TEST'
  )

  const operation =
    createSyncOperation({

      type:
        OPERATION_TYPES.UPDATE,

      repository:
        REPOSITORY_TYPES.LAYER,

      adapter:
        ADAPTER_TYPES.LOCAL,

      layerId:
        'integration-test-layer',

      payload: {

        id:
          'integration-test-layer',

        name:
          'Integration Test',

        visible:
          true,

        opacity:
          1,

      },

    })

  console.log(
    'SYNC OPERATION CREATED',
    operation
  )

  syncQueue.enqueue(
    operation
  )

  console.log(
    'QUEUE SIZE:',
    syncQueue.size()
  )

  console.groupEnd()

}

export async function
runSynchronizationIntegrationTest() {

    console.group(
        'SYNCHRONIZATION INTEGRATION TEST'
    )

    console.log(
        'QUEUE SIZE BEFORE:',
        syncQueue.size()
    )

    await synchronizationManager.syncNow()

    console.log(
        'QUEUE SIZE AFTER:',
        syncQueue.size()
    )

    console.groupEnd()

}