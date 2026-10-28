const listeners = new Set()

export const publicFacilityEditorState = {
  placing: false,
  saving: false,
  draft: null,
  feedback: '',
  error: false,
}

const notify = () => {
  listeners.forEach((listener) => listener())
}

export const publicFacilityEditorStore = {
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  setState(updates) {
    Object.assign(publicFacilityEditorState, updates)
    notify()
  },
}
