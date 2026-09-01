import {
  AppError,
} from "../errors/AppError.js";

export const notFoundHandler = (
  request,
  response,
  next
) => {

  next(
    new AppError(
      `Route not found: ${request.method} ${request.originalUrl}`,
      404,
      "ROUTE_NOT_FOUND"
    )
  );

};