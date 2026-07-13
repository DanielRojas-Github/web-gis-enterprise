import { SyncAdapter }
  from './SyncAdapter'

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
      operation.layerId
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

    return {

      success:true,

      timestamp:Date.now()

    }

  }

}