export function createPersistenceResult({

  success = true,

  operationId = null,

  repository = null,

  adapter = null,

  timestamp = Date.now(),

  data = null,

  error = null,

} = {}) {

  return {

    success,

    operationId,

    repository,

    adapter,

    timestamp,

    data,

    error,

  }

}