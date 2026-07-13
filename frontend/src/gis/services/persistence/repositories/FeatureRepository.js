import { BaseRepository }
  from './BaseRepository'

import {
  saveFeatures,
  loadFeatures,
  clearFeatures,
} from '../services/featureStorageService'

export class FeatureRepository
  extends BaseRepository {

  async create(feature) {

    console.log(
      'CREATE FEATURE'
    )

    // Se implementará más adelante

    return true

  }

  async update(feature) {

    console.log(
      'UPDATE FEATURE'
    )

    // Temporalmente reutilizamos
    // el almacenamiento existente.
    saveFeatures(feature)

    return true

  }

  async find(id) {

    console.log(
      'FIND FEATURE',
      id
    )

    // Lo implementaremos
    // cuando migremos a StorageProvider.

    return null

  }

  async findAll() {

    console.log(
      'LOAD FEATURES'
    )

    return loadFeatures()

  }

  async delete(id) {

    console.log(
      'DELETE FEATURE',
      id
    )

    // Temporal
    clearFeatures()

    return true

  }

}