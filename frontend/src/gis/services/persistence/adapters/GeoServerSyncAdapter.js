import { SyncAdapter } from './SyncAdapter'

// Remote writes are not implemented yet. Inherit SyncAdapter's explicit
// "not implemented" errors so the persistence engine reports failures instead
// of treating unpersisted changes as successful.
export class GeoServerSyncAdapter extends SyncAdapter {}
