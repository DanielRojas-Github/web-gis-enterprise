import {
    synchronizationManager,
} from '@/gis/synchronization/SynchronizationManager'

export function registerDeveloperAPI() {

    if (!import.meta.env.DEV) {
        return
    }

    window.gis = {

        syncNow: async () => {

            await synchronizationManager
                .syncNow()

        },

    }

    console.log(
        'GIS DEVELOPER API REGISTERED'
    )

}