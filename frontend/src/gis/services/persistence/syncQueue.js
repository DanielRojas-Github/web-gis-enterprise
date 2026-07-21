// =======================================
// Enterprise GIS
// Sync Queue
// =======================================



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