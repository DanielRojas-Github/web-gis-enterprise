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

import { useLayerSynchronization }
from '@/gis/synchronization/hooks/useLayerSynchronization'

export default function GISSystemManager() {

  useEffect(() => {

    console.log(
      'GIS SYSTEM STARTED'
    )

    bootstrapGIS()

  }, [])

  useAutosave()

   usePersistenceEngine()

   useLayerSynchronization()

  // useSyncEngine()

  // useVersioningEngine()

  return null
}