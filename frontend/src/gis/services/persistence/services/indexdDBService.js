const DATABASE_NAME = 'EnterpriseGIS'

const DATABASE_VERSION = 1

const OPERATIONS_STORE = 'operations'

class IndexedDBService {

  constructor() {

    this.db = null

  }

  async open() {

    if (this.db) {

      return this.db

    }

    return new Promise(
      (resolve, reject) => {

        const request =
          indexedDB.open(
            DATABASE_NAME,
            DATABASE_VERSION
          )

        request.onupgradeneeded =
          event => {

            const db =
              event.target.result

            if (
              !db.objectStoreNames.contains(
                OPERATIONS_STORE
              )
            ) {

              db.createObjectStore(
                OPERATIONS_STORE,
                {
                  keyPath: 'id',
                }
              )

            }

          }

        request.onsuccess =
          () => {

            this.db =
              request.result

            console.log(
              'INDEXEDDB OPENED'
            )

            resolve(
              this.db
            )

          }

        request.onerror =
          () => {

            reject(
              request.error
            )

          }

      }
    )

  }

}

export const indexedDBService =
  new IndexedDBService()