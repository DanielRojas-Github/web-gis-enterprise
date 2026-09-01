import {
  getRoads as getRoadsService,
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