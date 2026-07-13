import {
  AdapterFactory,
} from './adapters/AdapterFactory'

const adapter =
  AdapterFactory.create()

export const remoteSyncService = {

  async create(operation) {

    return adapter.create(
      operation
    )

  },

  async update(operation) {

    return adapter.update(
      operation
    )

  },

  async delete(operation) {

    return adapter.delete(
      operation
    )

  },

}