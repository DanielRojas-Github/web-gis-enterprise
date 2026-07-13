import { registerTools }
  from '@/gis/tools/registerTools'

import { registerRepositories }
  from '@/gis/services/persistence/repositories/registerRepositories'

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

  initialized = true

  console.log(
    'GIS BOOTSTRAP COMPLETED'
  )

}