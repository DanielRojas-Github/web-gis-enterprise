import { useEffect } from 'react'

// import {
//     persistenceEngine,
// } from '@/gis/services/persistence/PersistenceEngine'

import {
    synchronizationManager,
} from '@/gis/synchronization/SynchronizationManager'

import {
    registerDeveloperAPI,
} from '@/gis/services/persistence/dev/GISDeveloperAPI'

export const usePersistenceEngine = () => {

    useEffect(() => {

        console.log(
            'Persistence Engine Hook Mounted'
        )

        // persistenceEngine.start()
        synchronizationManager.start()

        registerDeveloperAPI()

        return () => {
          //  persistenceEngine.stop()
            synchronizationManager.stop()

            console.log(
                'Persistence Engine Hook Unmounted'
            )

        }

    }, [])

}