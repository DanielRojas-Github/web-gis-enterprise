export const CONFIG_ERRORS = {

  INVALID_PORT:
    "PORT must be an integer between 1 and 65535",

  INVALID_GEOSERVER_URL:
    "GEOSERVER_URL must be a valid HTTP or HTTPS URL",

  INVALID_DB_PORT:
    "DB_PORT must be an integer between 1 and 65535",

  INVALID_DB_HOST:
    "DB_HOST must not be empty",

  INVALID_DB_NAME:
    "DB_NAME must not be empty",

  INVALID_DB_USER:
    "DB_USER must not be empty",

  INVALID_DB_PASSWORD:
    "DB_PASSWORD must not be empty",
  INVALID_GEOSERVER_USER:
  "GEOSERVER_USER must be a non-empty string",

INVALID_GEOSERVER_PASSWORD:
  "GEOSERVER_PASSWORD must be a non-empty string",

INVALID_GEOSERVER_TIMEOUT:
  "GEOSERVER_TIMEOUT must be an integer greater than 0",

  INVALID_OIDC_CONFIGURATION:
    "OIDC_ISSUER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_REDIRECT_URI, and SESSION_SECRET must be configured together",

  INVALID_OIDC_ISSUER:
    "OIDC_ISSUER must be a valid HTTPS URL",

  INVALID_OIDC_REDIRECT_URI:
    "OIDC_REDIRECT_URI must be a valid HTTPS URL",

  INVALID_SESSION_SECRET:
    "SESSION_SECRET must contain at least 32 characters",

  INVALID_CORS_ORIGINS:
    "CORS_ALLOWED_ORIGINS must contain one or more valid origins in production",

  INVALID_COOKIE_SAME_SITE:
    "SESSION_COOKIE_SAME_SITE must be lax, strict, or none",

  INVALID_RUN_MIGRATIONS_ON_START:
    "RUN_MIGRATIONS_ON_START must be true or false",

};
