import { SyncAdapter }
  from './SyncAdapter'
import { createPersistenceResult }
  from '../models/PersistenceResult'


export class GeoServerSyncAdapter
  extends SyncAdapter {

  async create(operation){

    console.log(
      'GEOSERVER CREATE',
      operation.layerId
    )

    return {

      success:true,

      timestamp:Date.now()

    }

  }

  async update(operation){

    console.log(
      'GEOSERVER UPDATE',
      operation
    )

    return {

      success:true,

      timestamp:Date.now()

    }

  }

  async delete(operation){

    console.log(
      'GEOSERVER DELETE',
      operation.layerId
    )

    return createPersistenceResult({

    success: true,

    operationId: operation.id,

    repository: operation.repository,

    adapter: operation.adapter,

})
  }

}