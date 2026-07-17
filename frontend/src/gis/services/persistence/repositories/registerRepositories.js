import {
  repositoryFactory,
} from './RepositoryFactory'

import {
  LayerRepository,
} from './LayerRepository'

import {
  FeatureRepository,
} from './FeatureRepository'

import {
  REPOSITORY_TYPES,
} from '../constants/repositoryTypes'

export function registerRepositories() {

  repositoryFactory.register(

    REPOSITORY_TYPES.LAYER,

    new LayerRepository()

  )

  repositoryFactory.register(

    REPOSITORY_TYPES.FEATURE,

    new FeatureRepository()

  )

  console.log(

    'ALL REPOSITORIES REGISTERED'

  )

}