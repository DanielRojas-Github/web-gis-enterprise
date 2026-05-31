console.log('DrawStore.js loaded')
export const drawState = {

  points: [],

  listeners: [],

  setPoints(points) {

    this.points = points

    this.listeners.forEach(
      listener => listener()
    )
  },

  clear() {

    this.setPoints([])
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
}