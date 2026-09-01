import dotenv
  from "dotenv";

import {
  CONFIG_ERRORS,
} from "./configErrors.js";


dotenv.config();


const getEnv = (
  name,
  defaultValue
) => {

  const value =
    process.env[name];

  if (
    value !== undefined &&
    value !== ""
  ) {

    return value;

  }

  return defaultValue;

};


const getPort = () => {

  const port =
    Number(
      getEnv(
        "PORT",
        3000
      )
    );

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {

    throw new Error(
      CONFIG_ERRORS.INVALID_PORT
    );

  }

  return port;

};


const getGeoServerUrl = () => {

  const value =
    getEnv(
      "GEOSERVER_URL",
      "http://localhost:8080/geoserver"
    );

  try {

    const url =
      new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {

      throw new Error();

    }

    return value;

  } catch {

    throw new Error(
      CONFIG_ERRORS.INVALID_GEOSERVER_URL
    );

  }

};


const getDbPort = () => {

  const port =
    Number(
      getEnv(
        "DB_PORT",
        5432
      )
    );

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {

    throw new Error(
      CONFIG_ERRORS.INVALID_DB_PORT
    );

  }

  return port;

};


const getRequiredEnv = (
  name,
  defaultValue,
  errorMessage
) => {

  const rawValue =
    process.env[name];

  if (
    rawValue !== undefined &&
    rawValue.trim() === ""
  ) {

    throw new Error(
      errorMessage
    );

  }

  const value =
    rawValue ?? defaultValue;

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {

    throw new Error(
      errorMessage
    );

  }

  return value;

};


export const env = {

  port:
    getPort(),

  geoserverUrl:
    getGeoServerUrl(),

  db: {

    host:
      getRequiredEnv(
        "DB_HOST",
        "localhost",
        CONFIG_ERRORS.INVALID_DB_HOST
      ),

    port:
      getDbPort(),

    name:
      getRequiredEnv(
        "DB_NAME",
        "gisdb",
        CONFIG_ERRORS.INVALID_DB_NAME
      ),

    user:
      getRequiredEnv(
        "DB_USER",
        "postgres",
        CONFIG_ERRORS.INVALID_DB_USER
      ),

    password:
      getRequiredEnv(
        "DB_PASSWORD",
        "",
        CONFIG_ERRORS.INVALID_DB_PASSWORD
      ),

  },

};