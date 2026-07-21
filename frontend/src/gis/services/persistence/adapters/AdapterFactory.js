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