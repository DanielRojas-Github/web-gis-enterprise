export class GeoServerError
  extends Error {

  constructor({
    message,
    statusCode = 502,
    code = "GEOSERVER_ERROR",
  }) {

    super(message);

    this.name =
      "GeoServerError";

    this.statusCode =
      statusCode;

    this.code =
      code;

  }

}