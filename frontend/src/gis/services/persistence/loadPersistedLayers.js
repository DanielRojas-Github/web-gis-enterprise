import {
  repositoryFactory,
} from '../repositories/RepositoryFactory'

import {
  REPOSITORY_TYPES,
} from './constants/repositoryTypes'

export async function loadPersistedLayers() {

  const repository =
    repositoryFactory.getRepository(

      REPOSITORY_TYPES.LAYER

    )

  return await repository.findAll()

}