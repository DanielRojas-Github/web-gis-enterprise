export const editHistoryStore = {

  history: [],

  future: [],

  saveSnapshot(features) {

    this.history.push(
      structuredClone(features)
    )

    this.future = []
  },

  undo(currentFeatures) {

    if (
      this.history.length === 0
    ) {
      return null
    }

    const previousState =
      this.history.pop()

    this.future.push(
      structuredClone(
        currentFeatures
      )
    )

    return previousState
  },

  redo(currentFeatures) {

    if (
      this.future.length === 0
    ) {
      return null
    }

    const nextState =
      this.future.pop()

    this.history.push(
      structuredClone(
        currentFeatures
      )
    )

    return nextState
  },

  clear() {

    this.history = []

    this.future = []
  },
}