import { drawState }
    from '@/gis/tools/overlays/draw/drawStore'

import {
    loadFeatures,
}
    from './services/featureStorageService'

export function
    initializeFeaturePersistence() {


    const features =
        loadFeatures()



    if (
        features.length > 0
    ) {



        drawState.setFeatures(
            features
        )


    }
}