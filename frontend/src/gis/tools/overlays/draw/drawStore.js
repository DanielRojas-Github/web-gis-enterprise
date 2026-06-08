
import {
  saveFeatures,
}
from '@/gis/services/persistence/featureStorageService'

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

        this.listeners.forEach(
            listener => listener()
        )
    },

    setFinished(value) {

        this.finished = value

        this.listeners.forEach(
            listener => listener()
        )
    },

    setPoints(points) {

        this.points = points

        this.listeners.forEach(
            listener => listener()
        )
    },

    clear() {

        this.points = []

        this.finished = false

        this.listeners.forEach(
            listener => listener()
        )
    },

    subscribe(listener) {

        this.listeners.push(listener)

        return () => {

            this.listeners =
                this.listeners.filter(
                    l => l !== listener
                )
        }
    },

  addFeature(feature) {

  

  this.features.push(feature)

  saveFeatures(
    this.features
  )

  this.listeners.forEach(
    listener => listener()
  )
 
},

  removeFeature(id) {

  this.features =
    this.features.filter(
      feature =>
        feature.id !== id
    )

  saveFeatures(
    this.features
  )

  this.listeners.forEach(
    listener => listener()
  )
},

  updateFeature(updatedFeature) {

  this.features =
    this.features.map(
      feature =>
        feature.id ===
        updatedFeature.id
          ? updatedFeature
          : feature
    )

  saveFeatures(
    this.features
  )

  this.listeners.forEach(
    listener => listener()
  )
},

  setFeatures(features) {

  this.features = features

  saveFeatures(
    this.features
  )

  this.listeners.forEach(
    listener => listener()
  )
},
}
