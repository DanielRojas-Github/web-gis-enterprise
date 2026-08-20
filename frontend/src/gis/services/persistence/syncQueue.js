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

  const existingOperation =
    this.findPendingByLayerId(
      operation.layerId
    )

  if (
    existingOperation &&
    existingOperation.type === operation.type &&
    operation.type === 'UPDATE'
  ) {

    existingOperation.payload =
      operation.payload

    existingOperation.updatedAt =
      operation.updatedAt

    console.log(
      'SYNC QUEUE → UPDATE EXISTING OPERATION',
      existingOperation.id
    )

    return existingOperation
  }

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

    return existingOperation
  }

  this.queue.push(
    operation
  )

  console.log(
    'SYNC QUEUE → ENQUEUE',
    operation
  )

  return operation
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

 findPendingByContext(operationData) {

  return this.queue.find(
    operation =>

      operation.status ===
        OPERATION_STATUS.PENDING &&

      operation.type ===
        operationData.type &&

      operation.repository ===
        operationData.repository &&

      operation.adapter ===
        operationData.adapter &&

      operation.layerId ===
        operationData.layerId &&

      operation.featureId ===
        operationData.featureId
  )

}
  findPendingByLayerId(layerId) {

  return this.queue.find(
    operation =>
      operation.layerId === layerId
  )

}

}

export const syncQueue =
  new SyncQueue()