import {
  OPERATION_STATUS
} from './operationStatus'

class OperationLifecycle {

  markPending(operation) {

    operation.status =
      OPERATION_STATUS.PENDING

    operation.updatedAt =
      Date.now()

    return operation
  }

 markProcessing(operation) {

  operation.status =
    OPERATION_STATUS.PROCESSING

  operation.updatedAt =
    Date.now()

  operation.retries =
    (operation.retries ?? 0) + 1

  console.log(
    'OPERATION → PROCESSING',
    operation.id
  )

  return operation

}

  markSuccess(operation) {

    operation.status =
      OPERATION_STATUS.SUCCESS

    operation.updatedAt =
      Date.now()

    operation.error = null

    console.log(
      'OPERATION → SUCCESS',
      operation.id
    )

    return operation
  }

  markFailed(
    operation,
    error = null
  ) {

    operation.status =
      OPERATION_STATUS.FAILED

    operation.updatedAt =
      Date.now()

    operation.error =
      error?.message ?? null

    console.log(
      'OPERATION → FAILED',
      operation.id,
      operation.error
    )

    return operation
  }

}

export const operationLifecycle =
  new OperationLifecycle()