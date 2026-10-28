import {
  createPublicFacility,
  deletePublicFacility,
  getPublicFacilities,
  updatePublicFacility,
} from "../services/publicFacilityService.js";

import {
  successResponse,
} from "../utils/apiResponse.js";

export async function getPublicFacilitiesController(
  request,
  response,
  next
) {
  try {
    const facilities = await getPublicFacilities();
    return successResponse(response, facilities);
  } catch (error) {
    return next(error);
  }
}

export async function createPublicFacilityController(
  request,
  response,
  next
) {
  try {
    const feature = await createPublicFacility(request.body);
    return successResponse(response, feature, 201);
  } catch (error) {
    return next(error);
  }
}

export async function updatePublicFacilityController(
  request,
  response,
  next
) {
  try {
    const feature = await updatePublicFacility(
      Number(request.params.id),
      request.body
    );
    return successResponse(response, feature);
  } catch (error) {
    return next(error);
  }
}

export async function deletePublicFacilityController(
  request,
  response,
  next
) {
  try {
    const result = await deletePublicFacility(
      Number(request.params.id)
    );
    return successResponse(response, result);
  } catch (error) {
    return next(error);
  }
}
