import {
  ADAPTER_TYPES,
} from '../constants/adapterTypes'

import {
  GeoServerSyncAdapter,
} from './GeoServerSyncAdapter'

import {
  LocalSyncAdapter,
} from './LocalSyncAdapter'

class AdapterFactory {

  constructor() {

    this.adapters = {

      [ADAPTER_TYPES.LOCAL]:
        new LocalSyncAdapter(),

      [ADAPTER_TYPES.GEOSERVER]:
        new GeoServerSyncAdapter(),

      /*
       * Próximamente
       *
       * [ADAPTER_TYPES.INDEXED_DB]&#58;        *   new IndexedDBSyncAdapter(),
       *
       * [ADAPTER_TYPES.REST]&#58;        *   new RestSyncAdapter(),
       *
       */

    }

  }

  getAdapter(type) {

    const adapter =
      this.adapters[type]

    if (!adapter) {

      throw new Error(
        `Adapter "${type}" not found`
      )

    }

    return adapter

  }

}

export const adapterFactory =
  new AdapterFactory()