import { v4 as uuid } from 'uuid'

import {
  OPERATION_STATUS,
} from '../lifecycle/operationStatus'

import {
  ADAPTER_TYPES,
} from '../constants/adapterTypes'

export function createSyncOperation({
  type,
  repository,
  adapter= ADAPTER_TYPES.LOCAL,
  layerId,
  featureId,
  payload,
}) {

 return {

  id: uuid(),
  type,
  repository,
 
  adapter,
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