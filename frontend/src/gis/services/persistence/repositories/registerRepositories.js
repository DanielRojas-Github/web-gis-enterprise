import {
  repositoryFactory,
} from './RepositoryFactory'

import {
  LayerRepository,
} from './LayerRepository'

import {
  FeatureRepository,
} from './FeatureRepository'

export function registerRepositories() {

  repositoryFactory.register(
    'layer',
    new LayerRepository()
  )

  repositoryFactory.register(
    'feature',
    new FeatureRepository()
  )

  console.log(
    'ALL REPOSITORIES REGISTERED'
  )

}