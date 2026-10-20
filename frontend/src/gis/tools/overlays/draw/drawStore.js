
import { saveFeatures } from '@/gis/services/persistence/services/featureStorageService'

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
    this.features = [...this.features, feature]

    saveFeatures(this.features)

    notifyListeners(this.listeners)
  },

  removeFeature(id) {
    this.features = this.features.filter(
      (feature) => feature.id !== id
    )

    saveFeatures(this.features)

    notifyListeners(this.listeners)
  },

  updateFeature(updatedFeature) {
    this.features = this.features.map((feature) =>
      feature.id === updatedFeature.id
        ? updatedFeature
        : feature
    )

    saveFeatures(this.features)

    notifyListeners(this.listeners)
  },

  setFeatures(features) {
    this.features = features

    saveFeatures(this.features)

    notifyListeners(this.listeners)
  },
}
