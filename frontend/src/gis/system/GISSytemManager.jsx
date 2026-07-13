import { useEffect } from 'react'

import { bootstrapGIS }
  from '@/gis/bootstrap/bootstrapGIS'

import { useAutosave }
  from './useAutosave'

import { usePersistenceEngine }
  from './usePersistenceEngine'

// import { useSyncEngine }
//   from './useSyncEgine'

// import { useVersioningEngine }
//   from './useVersioningEngine'

export default function GISSystemManager() {

  useEffect(() => {

    console.log(
      'GIS SYSTEM STARTED'
    )

    bootstrapGIS()

  }, [])

  useAutosave()

   usePersistenceEngine()

  // useSyncEngine()

  // useVersioningEngine()

  return null
}