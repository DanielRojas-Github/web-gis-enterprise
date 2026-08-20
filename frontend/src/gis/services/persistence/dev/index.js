import {
    persistenceIntegrationTest
} from '@/gis/services/persistence/dev/persistenceIntegrationTest.js' 

export const runPersistenceDevTools = () => {

    if (!import.meta.env.DEV) {

        return

    }

    console.log(
        'RUNNING PERSISTENCE DEV TOOLS'
    )

    persistenceIntegrationTest()

}