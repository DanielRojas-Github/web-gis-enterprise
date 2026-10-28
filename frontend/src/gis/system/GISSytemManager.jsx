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
  useAutosave()

   usePersistenceEngine()

   useLayerSynchronization()

  // useSyncEngine()

  // useVersioningEngine()

  return null
}
