import { v4 as uuid } from 'uuid'

import {
  OPERATION_STATUS,
} from './lifecycle/operationStatus'

export function createSyncOperation({
  type,
  layerId,
  featureId = null,
  payload,
}) {

 return {

  id: uuid(),

  type,

  layerId,

  featureId,

  payload,

  status:
    OPERATION_STATUS.PENDING,

  retries: 0,

  maxRetries: 3,

  error: null,

  lastAttempt: null,

  createdAt:
    Date.now(),

  updatedAt:
    Date.now(),

}

}