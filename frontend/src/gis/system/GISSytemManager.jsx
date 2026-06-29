import { useAutosave }
  from './useAutosave'

export default function GISSystemManager() {
    console.log('GISSystemManager mounted')

  useAutosave()

  return null
}