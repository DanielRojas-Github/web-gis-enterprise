import { registerTools }
  from '@/gis/tools/registerTools'

import { registerRepositories }
  from '@/gis/services/persistence/repositories/registerRepositories'

import {
  runPersistenceDevTools,
} from '@/gis/services/persistence/dev'

let initialized = false

export function bootstrapGIS() {

  if (initialized) {

    console.log(
      'GIS ALREADY INITIALIZED'
    )

    return
  }

  console.log(
    'BOOTSTRAPPING GIS...'
  )

  registerTools()

  registerRepositories()

if (import.meta.env.DEV) {

  runPersistenceDevTools()

}

  initialized = true

  console.log(
    'GIS BOOTSTRAP COMPLETED'
  )

}