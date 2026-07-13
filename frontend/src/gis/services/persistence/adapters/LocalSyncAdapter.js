import { SyncAdapter }
  from './SyncAdapter'

export class LocalSyncAdapter
  extends SyncAdapter {

  async create(operation){

    return {

      success:true,

      timestamp:Date.now()

    }

  }

  async update(operation){

    return {

      success:true,

      timestamp:Date.now()

    }

  }

  async delete(operation){

    return {

      success:true,

      timestamp:Date.now()

    }

  }

}