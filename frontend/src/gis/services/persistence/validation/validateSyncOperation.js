import {
  OPERATION_TYPES,
} from '../constants/operationTypes'

import {
  REPOSITORY_TYPES,
} from '../constants/repositoryTypes'

import {
  ADAPTER_TYPES,
} from '../constants/adapterTypes'

export function validateSyncOperation(
  operation
) {

  if (!operation) {

    throw new Error(
      'Operation is required'
    )

  }

  if (!operation.type) {

    throw new Error(
      'Operation type is required'
    )

  }

  if (
    !Object.values(
      OPERATION_TYPES
    ).includes(
      operation.type
    )
  ) {

    throw new Error(

      `Invalid operation type: ${operation.type}`

    )

  }

  if (!operation.repository) {

    throw new Error(
      'Repository is required'
    )

  }

  if (
    !Object.values(
      REPOSITORY_TYPES
    ).includes(
      operation.repository
    )
  ) {

    throw new Error(

      `Invalid repository: ${operation.repository}`

    )

  }

  if (!operation.adapter) {

    throw new Error(
      'Adapter is required'
    )

  }

  if (
    !Object.values(
      ADAPTER_TYPES
    ).includes(
      operation.adapter
    )
  ) {

    throw new Error(

      `Invalid adapter: ${operation.adapter}`

    )

  }

  if (
    operation.payload === undefined
  ) {

    throw new Error(
      'Payload is required'
    )

  }

}