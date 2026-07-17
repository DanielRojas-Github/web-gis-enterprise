import {
  repositoryFactory,
} from '../repositories/RepositoryFactory'

import {
  SyncAdapter,
} from './SyncAdapter'

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

    return {

      success: true,

      timestamp: Date.now(),

    }

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