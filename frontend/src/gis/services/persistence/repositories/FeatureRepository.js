import { BaseRepository } from './BaseRepository'
import {
  loadFeatures,
  saveFeatures,
} from '../services/featureStorageService'

export class FeatureRepository extends BaseRepository {
  readFeatures() {
    const features = loadFeatures()

    if (!Array.isArray(features)) {
      throw new Error(
        'Invalid persisted feature collection. Stored data was not modified.'
      )
    }

    return features
  }

  create(feature) {
    if (!feature?.id) {
      throw new Error('Cannot create a feature without an id.')
    }

    const features = this.readFeatures()
    const exists = features.some(
      (item) => item.id === feature.id
    )

    if (exists) {
      throw new Error(
        `Cannot create feature "${feature.id}": id already exists.`
      )
    }

    saveFeatures([...features, feature])

    return true
  }

  update(feature) {
    if (!feature?.id) {
      throw new Error('Cannot update a feature without an id.')
    }

    const features = this.readFeatures()
    const index = features.findIndex(
      (item) => item.id === feature.id
    )

    if (index === -1) {
      throw new Error(
        `Cannot update feature "${feature.id}": feature not found.`
      )
    }

    const nextFeatures = [...features]
    nextFeatures[index] = feature
    saveFeatures(nextFeatures)

    return true
  }

  find(id) {
    if (!id) {
      return null
    }

    const features = this.readFeatures()

    return features.find(
      (feature) => feature.id === id
    ) ?? null
  }

  findAll() {
    const features = this.readFeatures()

    return [...features]
  }

  replaceAll(features) {
    if (!Array.isArray(features)) {
      throw new Error('Cannot replace features with a non-array value.')
    }

    const ids = new Set()

    for (const feature of features) {
      if (!feature?.id) {
        throw new Error('Cannot persist a feature without an id.')
      }

      if (ids.has(feature.id)) {
        throw new Error(
          `Cannot persist feature "${feature.id}": id already exists.`
        )
      }

      ids.add(feature.id)
    }

    saveFeatures([...features])

    return true
  }

  delete(id) {
    if (!id) {
      throw new Error('Cannot delete a feature without an id.')
    }

    const features = this.readFeatures()
    const nextFeatures = features.filter(
      (feature) => feature.id !== id
    )

    if (nextFeatures.length === features.length) {
      throw new Error(
        `Cannot delete feature "${id}": feature not found.`
      )
    }

    saveFeatures(nextFeatures)

    return true
  }
}
