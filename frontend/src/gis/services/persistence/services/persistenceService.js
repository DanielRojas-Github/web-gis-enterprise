import {
  adapterFactory,
} from '../adapters/AdapterFactory'

import {
  ADAPTER_TYPES,
} from '../constants/adapterTypes'

const DEFAULT_ADAPTER =
  ADAPTER_TYPES.LOCAL

class PersistenceService {

  getAdapter(operation) {

    return adapterFactory.getAdapter(

      operation.adapter ??

      DEFAULT_ADAPTER

    )

  }

  async execute(
    operation,
    action
  ) {

    console.log(

      `PERSISTENCE SERVICE → ${action.toUpperCase()}`,

      operation.layerId

    )

    const adapter =
      this.getAdapter(operation)

    return adapter[action](
      operation
    )

  }

  create(operation) {

    return this.execute(
      operation,
      'create'
    )

  }

  update(operation) {

    return this.execute(
      operation,
      'update'
    )

  }

  delete(operation) {

    return this.execute(
      operation,
      'delete'
    )

  }

}

export const persistenceService =
  new PersistenceService()