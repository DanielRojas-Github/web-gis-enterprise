console.log('MEASURE STORE LOADED')

export const measureState = {
  points: [],

  listeners: [],

  setPoints(newPoints) {
    this.points = newPoints

    this.listeners.forEach((listener) => {
      listener()
    })
  },

  subscribe(listener) {
    console.log('SUBSCRIBE EXISTS')

    this.listeners.push(listener)

    return () => {
      this.listeners =
        this.listeners.filter(
          (l) => l !== listener
        )
    }
  },
}