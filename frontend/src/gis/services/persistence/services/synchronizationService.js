import {
  adapterFactory,
} from '../adapters/AdapterFactory'

export class SynchronizationService {

  async execute(operation) {

    const adapter =
      adapterFactory.getAdapter(
        'local'
      )

    switch (operation.type) {

      case 'CREATE':
        return adapter.create(operation)

      case 'UPDATE':
        return adapter.update(operation)

      case 'DELETE':
        return adapter.delete(operation)

      default:

        throw new Error(
          `Unknown operation: ${operation.type}`
        )

    }

  }

}

export const synchronizationService =
  new SynchronizationService()