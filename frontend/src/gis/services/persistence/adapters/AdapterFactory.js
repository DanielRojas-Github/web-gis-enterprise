import {
  GeoServerSyncAdapter,
} from './GeoServerSyncAdapter'

export class AdapterFactory {

  static create() {

    return new GeoServerSyncAdapter()

  }

}