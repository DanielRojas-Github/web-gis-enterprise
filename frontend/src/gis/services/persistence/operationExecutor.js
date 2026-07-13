import {
  persistenceService,
} from './services/persistenceService.js'
//frontend\src\gis\services\persistence\services\persistenceService.js
export async function executeOperation(
  operation
) {
  console.log(
    'EXECUTING OPERATION:',
    operation
  )

  let response

  switch (operation.type) {
    case 'CREATE':
      response =
        await persistenceService.create(
          operation
        )
      break

    case 'UPDATE':
      response =
        await persistenceService.update(
          operation
        )
      break

    case 'DELETE':
      response =
        await persistenceService.delete(
          operation
        )
      break

    default:
      throw new Error(
        `Unknown operation: ${operation.type}`
      )
  }

  return {
    success: response.success,
    operationId: operation.id,
    layerId: operation.layerId,
    timestamp: response.timestamp,
  }
}