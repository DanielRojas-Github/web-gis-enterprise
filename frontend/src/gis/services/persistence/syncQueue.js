// =======================================
// Enterprise GIS
// Sync Queue
// =======================================

import {
  OPERATION_STATUS,
} from './lifecycle/operationStatus'

class SyncQueue {

  constructor() {
    this.queue = []
  }

  enqueue(operation) {

    const exists =
      this.queue.some(
        item =>
          item.id === operation.id
      )

    if (exists) {

      console.log(
        'SYNC QUEUE → DUPLICATE',
        operation.id
      )

      return
    }

    this.queue.push(operation)

    console.log(
      'SYNC QUEUE → ENQUEUE',
      operation
    )
  }

  dequeue() {

    if (this.isEmpty()) {
      return null
    }

    const operation =
      this.queue.shift()

    console.log(
      'SYNC QUEUE → DEQUEUE',
      operation
    )

    return operation
  }

  peek() {
    return this.queue[0] ?? null
  }

  clear() {

    this.queue = []

    console.log(
      'SYNC QUEUE CLEARED'
    )
  }

  hasItems() {
    return this.queue.length > 0
  }

  isEmpty() {
    return this.queue.length === 0
  }

  size() {
    return this.queue.length
  }

  getItems() {
    return [...this.queue]
  }
  markProcessing(operation) {

    operation.status =
      OPERATION_STATUS.PROCESSING

    operation.updatedAt =
      Date.now()

    operation.attempts =
      (operation.attempts ?? 0) + 1

    console.log(
      'SYNC QUEUE → PROCESSING',
      operation.id,
      'Attempt:',
      operation.attempts
    )

  }
  markSuccess(operation) {

    operation.status =
      OPERATION_STATUS.SUCCESS

    operation.updatedAt =
      Date.now()

    console.log(
      'SYNC QUEUE → SUCCESS',
      operation.id
    )

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
      'SYNC QUEUE → FAILED',
      operation.id,
      operation.error
    )

  }
  remove(operationId) {

    this.queue =
      this.queue.filter(
        operation =>
          operation.id !== operationId
      )

  }
  find(operationId) {

    return this.queue.find(
      operation =>
        operation.id === operationId
    )

  }

}

export const syncQueue =
  new SyncQueue()