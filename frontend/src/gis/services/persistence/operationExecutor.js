import {
  OPERATION_TYPES,
} from './constants/operationTypes'

import {
  persistenceService,
} from './services/persistenceService.js'

export async function executeOperation(
  operation
) {

  console.log(
    'EXECUTING OPERATION:',
    operation
  )

  let response

  switch (operation.type) {

    case OPERATION_TYPES.CREATE:

      response =
        await persistenceService.create(
          operation
        )

      break

    case OPERATION_TYPES.UPDATE:

      response =
        await persistenceService.update(
          operation
        )

      break

    case OPERATION_TYPES.DELETE:

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

    success:
      response.success,

    operationId:
      operation.id,

    layerId:
      operation.layerId,

    timestamp:
      response.timestamp,

  }

}