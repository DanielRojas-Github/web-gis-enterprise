import { syncQueue } from '@/gis/services/persistence/syncQueue'

import {
    executeOperation,
} from '@/gis/services/persistence/operationExecutor'

import {
    operationLifecycle,
} from '@/gis/services/persistence/lifecycle/operationLifecycle'

import {
    retryEngine,
} from '@/gis/services/persistence/lifecycle/retryEngine'

import {
    networkStatus,
} from '@/gis/services/persistence/networkStatus'

import {
    persistenceScheduler,
} from '@/gis/services/persistence/scheduler/PersistenceScheduler'


export class PersistenceEngine {

    constructor() {

        this.interval = null
        this.unsubscribe = null
        this.started = false

    }

    start() {
        if (this.started) {
            return
        }

        if (persistenceScheduler.isRunning()) {
            return
        }

        this.started = true
        console.log(
            'PERSISTENCE ENGINE STARTED'
        )
        persistenceScheduler.start()


        this.interval =
            setInterval(() => {

                void this.processNextOperation()

            }, 1000)
        this.unsubscribe =
            networkStatus.subscribe(
                online => {

                    if (!online) {
                        return
                    }

                    console.log(
                        'NETWORK RESTORED'
                    )

                    const operation =
                        syncQueue.peek()

                    if (!operation) {
                        return
                    }

                    console.log(
                        'PROCESSING IMMEDIATELY:',
                        operation.id
                    )

                }
            )
    }

    stop() {

        this.started = false

        if (
            !persistenceScheduler.isRunning()
        ) {
            return
        }

        if (this.unsubscribe) {

            this.unsubscribe()

            this.unsubscribe = null

        }

        persistenceScheduler.stop()

        if (this.interval) {

            clearInterval(
                this.interval
            )

            this.interval = null

        }

        console.log(
            'PERSISTENCE ENGINE STOPPED'
        )

    }

    async processNextOperation() {

        if (!networkStatus.isOnline()) {
            return
        }

        if (syncQueue.isEmpty()) {
            return
        }

        if (persistenceScheduler.isProcessing()) {
            return
        }

        const operation =
            syncQueue.dequeue()


        if (!operation) {
            return
        }
        persistenceScheduler
            .startProcessing()
        operationLifecycle.markProcessing(
            operation
        )

        try {

            const result =
                await executeOperation(
                    operation
                )

            console.log(
                'EXECUTION RESULT:',
                result
            )

            operationLifecycle.markSuccess(
                operation
            )

        }
        catch (error) {

            if (
                retryEngine.canRetry(
                    operation
                )
            ) {

                retryEngine.prepareRetry(
                    operation
                )

                const delay =

                    retryEngine.getDelay(
                        operation
                    )

                console.log(

                    'NEXT RETRY IN',

                    delay,

                    'ms'

                )

                setTimeout(() => {

                    syncQueue.enqueue(
                        operation
                    )

                }, delay)
            }
            else {

                retryEngine
                    .markPermanentFailure(
                        operation,
                        error
                    )

                console.error(
                    'MAX RETRIES REACHED',
                    operation.id
                )

            }
        }
        finally {

            persistenceScheduler
                .finishProcessing()
        }


    }
    hasPendingOperations() {

        return !syncQueue.isEmpty()

    }
}







export const persistenceEngine =
    new PersistenceEngine()
