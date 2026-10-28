
import { repositoryFactory } from '@/gis/services/persistence/repositories/RepositoryFactory'
import { REPOSITORY_TYPES } from '@/gis/services/persistence/constants/repositoryTypes'

const getFeatureRepository = () =>
  repositoryFactory.getRepository(REPOSITORY_TYPES.FEATURE)

const notifyListeners = (listeners) => {
  listeners.forEach((listener) => listener())
}

export const drawState = {
  type: 'polyline',
  finished: false,
  points: [],
  features: [],
  listeners: [],

  setType(type) {
    this.type = type
    this.points = []
    this.finished = false

    notifyListeners(this.listeners)
  },

  setFinished(value) {
    this.finished = value

    notifyListeners(this.listeners)
  },

  setPoints(points) {
    this.points = points

    notifyListeners(this.listeners)
  },

  clear() {
    this.points = []
    this.finished = false

    notifyListeners(this.listeners)
  },

  subscribe(listener) {
    this.listeners.push(listener)

    return () => {
      this.listeners = this.listeners.filter(
        (currentListener) => currentListener !== listener
      )
    }
  },

  addFeature(feature) {
    getFeatureRepository().create(feature)
    this.features = [...this.features, feature]

    notifyListeners(this.listeners)
  },

  removeFeature(id) {
    getFeatureRepository().delete(id)
    this.features = this.features.filter(
      (feature) => feature.id !== id
    )

    notifyListeners(this.listeners)
  },

  updateFeature(updatedFeature) {
    getFeatureRepository().update(updatedFeature)
    this.features = this.features.map((feature) =>
      feature.id === updatedFeature.id
        ? updatedFeature
        : feature
    )

    notifyListeners(this.listeners)
  },

  setFeatures(features) {
    getFeatureRepository().replaceAll(features)
    this.features = [...features]

    notifyListeners(this.listeners)
  },
}
