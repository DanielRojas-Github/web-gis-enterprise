import {
    persistenceEngine,
} from '@/gis/services/persistence/PersistenceEngine'

export class SynchronizationManager {

    constructor() {

        this.running = false

    }

    start() {

        if (this.running) {
            return
        }

        this.running = true
        console.log(
            'SYNCHRONIZATION MANAGER STARTED'
        )
        persistenceEngine.start()



    }

    stop() {

        if (!this.running) {
            return
        }

        this.running = false
        console.log(
            'SYNCHRONIZATION MANAGER STOPPED'
        )
        persistenceEngine.stop()



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
        persistenceEngine.hasPendingOperations()
    ) {

        await persistenceEngine
            .processNextOperation()

    }

    console.log(
        'MANUAL SYNCHRONIZATION COMPLETED'
    )

}

    isRunning() {

        return this.running

    }

}

export const synchronizationManager =
    new SynchronizationManager()