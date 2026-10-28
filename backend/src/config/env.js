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


const geoserverUser =
  getRequiredEnv(
    "GEOSERVER_USER",
    undefined,
    CONFIG_ERRORS.INVALID_GEOSERVER_USER
  );


const geoserverPassword =
  getRequiredEnv(
    "GEOSERVER_PASSWORD",
    undefined,
    CONFIG_ERRORS.INVALID_GEOSERVER_PASSWORD
  );

function getGeoServerTimeout() {

  const value =
    process.env
      .GEOSERVER_TIMEOUT ??
    "5000";

  const timeout =
    Number(value);


  if (
    !Number.isInteger(
      timeout
    ) ||
    timeout <= 0
  ) {

    throw new Error(
      CONFIG_ERRORS
        .INVALID_GEOSERVER_TIMEOUT
    );

  }


  return timeout;

}

const isProduction =
  process.env.NODE_ENV === "production";
const isDevelopment =
  process.env.NODE_ENV === "development";

const runMigrationsOnStartValue =
  getEnv(
    "RUN_MIGRATIONS_ON_START",
    isProduction ? "false" : "true"
  ).toLowerCase();

if (!["true", "false"].includes(runMigrationsOnStartValue)) {
  throw new Error(
    CONFIG_ERRORS.INVALID_RUN_MIGRATIONS_ON_START
  );
}

const frontendUrlValue =
  getEnv(
    "FRONTEND_URL",
    "http://localhost:5173"
  );

let frontendUrl;

try {
  frontendUrl = new URL(frontendUrlValue);
} catch {
  throw new Error("FRONTEND_URL must be a valid HTTP or HTTPS URL");
}

if (
  !["http:", "https:"].includes(frontendUrl.protocol) ||
  (isProduction && frontendUrl.protocol !== "https:")
) {
  throw new Error(
    "FRONTEND_URL must use HTTPS in production"
  );
}

const oidcIssuerValue =
  getEnv("OIDC_ISSUER", "").trim();
const oidcClientId =
  getEnv("OIDC_CLIENT_ID", "").trim();
const oidcClientSecret =
  getEnv("OIDC_CLIENT_SECRET", "");
const oidcRedirectUriValue =
  getEnv("OIDC_REDIRECT_URI", "").trim();
const sessionSecret =
  getEnv("SESSION_SECRET", "");

const oidcValues = [
  oidcIssuerValue,
  oidcClientId,
  oidcClientSecret,
  oidcRedirectUriValue,
  sessionSecret,
];

const isLoopbackHost = (hostname) =>
  ["localhost", "127.0.0.1", "[::1]"].includes(hostname);

const oidcEnabled =
  oidcValues.some(Boolean);

if (
  oidcEnabled &&
  oidcValues.some((value) => !value)
) {
  throw new Error(
    CONFIG_ERRORS.INVALID_OIDC_CONFIGURATION
  );
}

if (isProduction && !oidcEnabled) {
  throw new Error(
    "OIDC must be configured before starting the backend in production"
  );
}

let oidcIssuer;
let oidcRedirectUri;

if (oidcEnabled) {
  try {
    oidcIssuer = new URL(oidcIssuerValue);
  } catch {
    throw new Error(CONFIG_ERRORS.INVALID_OIDC_ISSUER);
  }

  const allowInsecureLocalIssuer =
    isDevelopment &&
    oidcIssuer.protocol === "http:" &&
    isLoopbackHost(oidcIssuer.hostname);

  if (
    oidcIssuer.protocol !== "https:" &&
    !allowInsecureLocalIssuer
  ) {
    throw new Error(CONFIG_ERRORS.INVALID_OIDC_ISSUER);
  }

  try {
    oidcRedirectUri = new URL(oidcRedirectUriValue);
  } catch {
    throw new Error(CONFIG_ERRORS.INVALID_OIDC_REDIRECT_URI);
  }

  if (
    !["http:", "https:"].includes(oidcRedirectUri.protocol) ||
    oidcRedirectUri.username ||
    oidcRedirectUri.password ||
    oidcRedirectUri.hash ||
    (oidcRedirectUri.protocol === "http:" &&
      (!isDevelopment ||
        !isLoopbackHost(oidcRedirectUri.hostname)))
  ) {
    throw new Error(CONFIG_ERRORS.INVALID_OIDC_REDIRECT_URI);
  }

  if (
    isProduction &&
    (oidcIssuer.protocol !== "https:" ||
      oidcRedirectUri.protocol !== "https:")
  ) {
    throw new Error(
      CONFIG_ERRORS.INVALID_OIDC_ISSUER
    );
  }

  if (sessionSecret.length < 32) {
    throw new Error(
      CONFIG_ERRORS.INVALID_SESSION_SECRET
    );
  }
}

const corsOriginsValue =
  getEnv(
    "CORS_ALLOWED_ORIGINS",
    isProduction ? "" : frontendUrl.origin
  );

let corsAllowedOrigins = [];

try {
  corsAllowedOrigins = corsOriginsValue
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      const parsedOrigin = new URL(origin);

      if (
        parsedOrigin.origin !== origin ||
        !["http:", "https:"].includes(parsedOrigin.protocol) ||
        (isProduction && parsedOrigin.protocol !== "https:")
      ) {
        throw new Error();
      }

      return parsedOrigin.origin;
    });
} catch {
  throw new Error(CONFIG_ERRORS.INVALID_CORS_ORIGINS);
}

if (isProduction && corsAllowedOrigins.length === 0) {
  throw new Error(CONFIG_ERRORS.INVALID_CORS_ORIGINS);
}

const cookieSameSite =
  getEnv(
    "SESSION_COOKIE_SAME_SITE",
    "lax"
  ).toLowerCase();

if (!["lax", "strict", "none"].includes(cookieSameSite)) {
  throw new Error(CONFIG_ERRORS.INVALID_COOKIE_SAME_SITE);
}

const oidcRolesClaim =
  getEnv(
    "OIDC_ROLES_CLAIM",
    "realm_access.roles"
  )
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

if (oidcRolesClaim.length === 0) {
  throw new Error("OIDC_ROLES_CLAIM must identify a claim path");
}

const gisReadRoles =
  getEnv(
    "GIS_READ_ROLES",
    "gis-reader,gis-editor,gis-admin"
  )
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

const gisWriteRoles =
  getEnv(
    "GIS_WRITE_ROLES",
    "gis-editor,gis-admin"
  )
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

if (cookieSameSite === "none" && !isProduction) {
  throw new Error(
    "SESSION_COOKIE_SAME_SITE=none is only allowed in production, where cookies are secure"
  );
}

export const env = {

  port:
    getPort(),

  geoserver: {

    url:
      getGeoServerUrl(),

    user:
      geoserverUser,

    password:
      geoserverPassword,
    timeout:
      getGeoServerTimeout(),
  },

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

  auth: {
    enabled: oidcEnabled,
    issuer: oidcIssuer?.toString(),
    clientId: oidcClientId,
    clientSecret: oidcClientSecret,
    redirectUri: oidcRedirectUri?.toString(),
    sessionSecret,
    frontendUrl: frontendUrl.toString(),
    cookieName: "webgis.sid",
    cookieSameSite,
    cookieSecure: isProduction,
    allowInsecureLocalIssuer:
      oidcEnabled &&
      oidcIssuer.protocol === "http:",
    rolesClaim: oidcRolesClaim,
    readRoles: gisReadRoles,
    writeRoles: gisWriteRoles,
    frontendLogoutUri:
      new URL("/login?logged_out=1", frontendUrl).toString(),
  },

  corsAllowedOrigins,

  trustProxy:
    getEnv("TRUST_PROXY", "false").toLowerCase() === "true",

  runMigrationsOnStart:
    runMigrationsOnStartValue === "true",

};
