import { useEffect } from 'react'

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

export const usePersistenceEngine =
  () => {
console.log(
    "Persistence Engine Hook Mounted"
)
    useEffect(() => {
      persistenceScheduler.start()
      console.log(
        'PERSISTENCE ENGINE STARTED'
      )

      const interval =
        setInterval(async () => {

          if (
            !networkStatus.isOnline()
          ) {

            console.log(
              'OFFLINE MODE'
            )

            return
          }

          if (
            syncQueue.isEmpty()
          ) {
            return
          }



          if (
            persistenceScheduler.isProcessing()
          ) {

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
        

        }, 1000)
      const unsubscribe =
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
      return () => {

        unsubscribe()
        persistenceScheduler.stop()

        clearInterval(
          interval
        )
console.log(
    "Persistence Engine Hook Unmounted"
)
        console.log(
          'PERSISTENCE ENGINE STOPPED'
        )

      }

    }, [])

  }