import {
  OPERATION_STATUS,
} from './operationStatus'

import { operationLifecycle } from './operationLifecycle'

export class RetryEngine {

  canRetry(operation) {

    return (
      operation.retries <
      operation.maxRetries
    )

  }

  prepareRetry(operation) {

  operation.status =
    OPERATION_STATUS.RETRYING

  operation.retries += 1

  operation.updatedAt =
    Date.now()

  operation.error = null

  operation.lastAttempt =
    Date.now()

  return operation

}
  

  markPermanentFailure(
  operation,error
) {
  operationLifecycle.markFailed(
                operation,error
              )


  return operation

}
getDelay(operation) {

  return Math.min(

    1000 *

    Math.pow(
      2,
      operation.retries
    ),

    30000

  )

}
}
export const retryEngine =
  new RetryEngine()