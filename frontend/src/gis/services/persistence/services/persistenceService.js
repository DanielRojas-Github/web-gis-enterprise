// import {
//   repositoryFactory,
// } from './repositories/RepositoryFactory'
export const persistenceService = {
  async update(operation) {
    console.log(
      'PERSISTENCE SERVICE → UPDATE',
      operation.layerId
    )

    // aquí irá:
    // REST
    // WFS-T
    // IndexedDB

    return {
      success: true,
      timestamp: Date.now(),
    }
  },

  async create(operation) {
    console.log(
      'PERSISTENCE SERVICE → CREATE',
      operation.layerId
    )

    return {
      success: true,
      timestamp: Date.now(),
    }
  },

  async delete(operation) {
    console.log(
      'PERSISTENCE SERVICE → DELETE',
      operation.layerId
    )

    return {
      success: true,
      timestamp: Date.now(),
    }
  },
}