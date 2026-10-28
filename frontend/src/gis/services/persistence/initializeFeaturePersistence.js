import { drawState }
    from '@/gis/tools/overlays/draw/drawStore'

import {
    repositoryFactory,
} from './repositories/RepositoryFactory'

import {
    REPOSITORY_TYPES,
} from './constants/repositoryTypes'

export function
    initializeFeaturePersistence() {


    const featureRepository =
        repositoryFactory.getRepository(
            REPOSITORY_TYPES.FEATURE
        )

    drawState.setFeatures(
        featureRepository.findAll()
    )
}
