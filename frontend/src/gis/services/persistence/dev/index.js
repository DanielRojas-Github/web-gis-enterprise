import {
  runPersistenceIntegrationTest,runSynchronizationIntegrationTest,
} from './persistenceIntegrationTest'



export function runPersistenceDevTools() {

  console.log(
    'RUNNING PERSISTENCE DEV TOOLS'
  )

  runPersistenceIntegrationTest()
  runSynchronizationIntegrationTest()

}