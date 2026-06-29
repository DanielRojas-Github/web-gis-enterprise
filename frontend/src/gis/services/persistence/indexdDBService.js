import {
  GIS_DB_NAME,
  GIS_DB_VERSION,
  GIS_LAYER_STORE,
} from './persistenceConstants'

let dbInstance = null

export const openDatabase =
  () =>
    new Promise(
      (
        resolve,
        reject
      ) => {
        if (dbInstance) {
          resolve(dbInstance)
          return
        }

        const request =
          indexedDB.open(
            GIS_DB_NAME,
            GIS_DB_VERSION
          )

        request.onerror =
          () =>
            reject(
              request.error
            )

        request.onsuccess =
          () => {
            dbInstance =
              request.result

            resolve(
              dbInstance
            )
          }

        request.onupgradeneeded =
          event => {
            const db =
              event.target
                .result

            if (
              !db.objectStoreNames.contains(
                GIS_LAYER_STORE
              )
            ) {
              db.createObjectStore(
                GIS_LAYER_STORE,
                {
                  keyPath: 'id',
                }
              )
            }
          }
      }
    )