import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import {
  dbPool,
} from "../config/database.js";

import {
  env,
} from "../config/env.js";

const PgSessionStore =
  connectPgSimple(session);

export const createAuthSessionMiddleware = () => {
  if (!env.auth.enabled) {
    return (_request, _response, next) => next();
  }

  return session({
    name: env.auth.cookieName,
    store: new PgSessionStore({
      pool: dbPool,
      tableName: "webgis_sessions",
      createTableIfMissing: true,
      pruneSessionInterval: 900,
    }),
    secret: env.auth.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.auth.cookieSecure,
      sameSite: env.auth.cookieSameSite,
      maxAge: 8 * 60 * 60 * 1000,
    },
  });
};
