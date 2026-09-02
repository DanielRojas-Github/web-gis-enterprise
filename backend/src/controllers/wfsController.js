import {
  getRoads as getRoadsService,
  getBuildings as getBuildingsService,
} from "../services/wfsService.js";

import {
  successResponse,
} from "../utils/apiResponse.js";


export async function getRoads(
  request,
  response,
  next
) {

  try {

    const roads =
      await getRoadsService();

    return successResponse(
      response,
      roads
    );

  } catch (error) {

    next(error);

  }

}


export async function getBuildings(
  request,
  response,
  next
) {

  try {

    const buildings =
      await getBuildingsService();

    return successResponse(
      response,
      buildings
    );

  } catch (error) {

    next(error);

  }

}