export class ImmediateSynchronizationStrategy {

    process(
        operation,
        persistenceEngine
    ) {

        persistenceEngine.enqueueOperation(
            operation
        )

    }

}

export const immediateSynchronizationStrategy =
    new ImmediateSynchronizationStrategy()