import {
  repositoryFactory,
} from '../repositories/RepositoryFactory'

import {
  SyncAdapter,
} from './SyncAdapter'


import {
  createPersistenceResult,
} from '../models/PersistenceResult'

export class LocalSyncAdapter
  extends SyncAdapter {

  getRepository(operation) {

    return repositoryFactory.getRepository(
      operation.repository
    )

  }

  async execute(
    operation,
    action,
    data
  ) {

    const repository =
      this.getRepository(operation)

    await repository[action](
      data
    )

  return createPersistenceResult({

  success: true,

  operationId:
    operation.id,

  repository:
    operation.repository,

  adapter:
    operation.adapter,

})

  }

  async create(operation) {

    return this.execute(

      operation,

      'create',

      operation.payload,

    )

  }

  async update(operation) {

    return this.execute(

      operation,

      'update',

      operation.payload,

    )

  }

  async delete(operation) {

    return this.execute(

      operation,

      'delete',

      operation.payload?.id,

    )

  }

}