import {
  getBuildings,
} from "../services/buildingService.js";

import {
  successResponse,
} from "../utils/apiResponse.js";


export async function getBuildingsController(
  request,
  response,
  next
) {

  try {

    const buildings =
      await getBuildings();

    return successResponse(
      response,
      buildings
    );

  } catch (error) {

    next(error);

  }

}