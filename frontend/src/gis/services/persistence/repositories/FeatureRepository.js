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



    return true

  }

  async update(feature) {

    console.log(
      'UPDATE FEATURE'
    )

    saveFeatures(feature)

    return true

  }

  async find(id) {

    console.log(
      'FIND FEATURE',
      id
    )

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