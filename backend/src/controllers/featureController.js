import {
  getFeatures as getFeaturesService,
} from "../services/featureService.js";

import {
  successResponse,
} from "../utils/apiResponse.js";

export function getFeatures(
  request,
  response
) {

  const features =
    getFeaturesService();

  return successResponse(
  response,
  features
);
}