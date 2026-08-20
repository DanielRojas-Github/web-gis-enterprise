import {
    persistenceEngine,
} from '@/gis/services/persistence/PersistenceEngine'

import {
    createSyncOperation,
} from '@/gis/services/persistence/models/SyncOperation'

import {
    immediateSynchronizationStrategy,
} from '@/gis/synchronization/strategies/ImmediateSynchronizationStrategy'

import {
    flattenLayers,
} from '@/gis/utils/flattenLayers'

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
    networkStatus,
} from '@/gis/services/persistence/networkStatus'

import {
    syncQueue,
} from '@/gis/services/persistence/syncQueue'
export class SynchronizationManager {

    constructor(engine) {
        this.engine = engine
        this.running = false
        this.strategy =
            immediateSynchronizationStrategy
        this.successListeners = []
        this.failureListeners = []

        this.engine.onOperationSuccess(result => {

            this.notifyOperationSuccess(result)

        }
        )
        this.engine.onOperationFailure(result => {

            this.notifyOperationFailure(
                result
            )

        }
        )

        this.unsubscribeNetwork =
            networkStatus.subscribe(
                online => {

                    if (!online) {
                        return
                    }

                    if (!this.running) {
                        return
                    }

                    this.syncNow()

                }
            )
    }
    start() {

        if (this.running) {
            return
        }

        this.running = true
        console.log(
            'SYNCHRONIZATION MANAGER STARTED'
        )
        this.engine.start()



    }

    stop() {

        if (!this.running) {
            return
        }

        this.running = false
        console.log(
            'SYNCHRONIZATION MANAGER STOPPED'
        )
        this.engine.stop()



    }

    async syncNow() {

        if (!this.running) {

            console.warn(
                'SYNCHRONIZATION MANAGER NOT RUNNING'
            )

            return

        }

        console.log(
            'MANUAL SYNCHRONIZATION STARTED'
        )
        // Process every pending operation until the queue is empty.
        while (
            this.engine.hasPendingOperations()
        ) {

            await this.engine
                .processNextOperation()

        }

        console.log(
            'MANUAL SYNCHRONIZATION COMPLETED'
        )

    }

    isRunning() {

        return this.running

    }

    queueOperation(operationData) {

        const existingOperation =
            syncQueue.findPendingByContext(
                operationData
            )

        if (existingOperation) {

            existingOperation.payload =
                operationData.payload

            existingOperation.updatedAt =
                Date.now()

            console.log(
                'SYNCHRONIZATION → OPERATION COALESCED:',
                existingOperation.id
            )

            return existingOperation
        }

        const operation =
            createSyncOperation(
                operationData
            )

        console.log(
            'QUEUE OPERATION:',
            operation.id
        )

        if (!this.running) {

            console.log(
                'SYNCHRONIZATION MANAGER NOT RUNNING — OPERATION QUEUED'
            )

            return operation
        }

        this.strategy.process(
            operation,
            this.engine
        )

        return operation
    }
    processAutosave(layers) {

        const flatLayers =
            flattenLayers(
                layers
            )

        const dirtyLayers =
            flatLayers.filter(
                layer =>
                    layer.dirty &&
                    !layer.saving
            )

        if (
            dirtyLayers.length === 0
        ) {
            return
        }

        for (
            const layer
            of dirtyLayers
        ) {

            this.queueOperation({

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

        }

    }

    onOperationSuccess(listener) {

        this.successListeners.push(listener)

    }
    onOperationFailure(listener) {

        this.failureListeners.push(
            listener
        )

    }

    notifyOperationSuccess(result) {

        this.successListeners.forEach(listener => {

            listener(result)

        })

    }
    notifyOperationFailure(result) {

        this.failureListeners.forEach(listener => {

            listener(result)

        })

    }
}

export const synchronizationManager =
    new SynchronizationManager(
        persistenceEngine
    )