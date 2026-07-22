import { useEffect } from 'react'

import {
    persistenceEngine,
} from '@/gis/services/persistence/PersistenceEngine'

export const usePersistenceEngine = () => {

    useEffect(() => {

        console.log(
            'Persistence Engine Hook Mounted'
        )

        persistenceEngine.start()

        return () => {

            persistenceEngine.stop()

            console.log(
                'Persistence Engine Hook Unmounted'
            )

        }

    }, [])

}