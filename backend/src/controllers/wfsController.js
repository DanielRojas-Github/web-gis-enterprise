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
      await getRoadsService(
        request.query
      );

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
      await getBuildingsService(
        request.query
      );

    return successResponse(
      response,
      buildings
    );

  } catch (error) {

    next(error);

  }

}