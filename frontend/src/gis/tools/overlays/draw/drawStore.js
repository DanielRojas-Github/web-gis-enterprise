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

  this.features.push(
    feature
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

  this.listeners.forEach(
    listener => listener()
  )
},
}