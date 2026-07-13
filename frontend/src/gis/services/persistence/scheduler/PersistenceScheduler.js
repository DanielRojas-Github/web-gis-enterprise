export class PersistenceScheduler {

    constructor() {

        this.running = false

        this.processing = false

    }

    start() {

        if (this.running) {
            return
        }

        this.running = true

        console.log(
            'PERSISTENCE SCHEDULER STARTED'
        )

    }

    stop() {

        if (!this.running) {
            return
        }

        this.running = false

        console.log(
            'PERSISTENCE SCHEDULER STOPPED'
        )

    }

    isRunning() {

        return this.running

    }
    isProcessing() {

        return this.processing

    }
    startProcessing() {

        if (this.processing) {
            return
        }

        this.processing = true

    }

    finishProcessing() {

        if (!this.processing) {
            return
        }

        this.processing = false

    }

    reset() {

        this.running = false

        this.processing = false

    }
}

export const persistenceScheduler =
    new PersistenceScheduler()