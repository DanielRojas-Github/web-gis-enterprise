import {
  randomUUID,
} from "crypto";


export const requestId = (
  request,
  response,
  next
) => {

  const id =
    request.headers["x-request-id"] ||
    randomUUID();

  request.requestId =
    id;

  response.setHeader(
    "X-Request-ID",
    id
  );

  next();

};