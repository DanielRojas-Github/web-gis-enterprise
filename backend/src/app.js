import express
  from "express";

import cors
  from "cors";

import helmet
  from "helmet";

import morgan
  from "morgan";

import apiRoutes
  from "./routes/apiRoutes.js";

import authRoutes
  from "./routes/authRoutes.js";

import {
  createAuthSessionMiddleware,
} from "./middleware/authSession.js";

import {
  requireAuthentication,
} from "./middleware/requireAuthentication.js";

import {
  requireGISReadRole,
} from "./middleware/requireGISReadRole.js";

import {
  env,
} from "./config/env.js";

import {
  errorHandler,
} from "./middleware/errorHandler.js";

import {
  requestId,
} from "./middleware/requestId.js";

import {
  notFoundHandler,
} from "./middleware/notFoundHandler.js";


const app =
  express();


morgan.token(
  "request-id",
  (request) =>
    request.requestId
);

morgan.token(
  "safe-url",
  (request) =>
    request.originalUrl.split("?")[0]
);


app.set("trust proxy", env.trustProxy);

app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      env.corsAllowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
}));

app.use(
  helmet()
);

app.use(
  requestId
);

app.use(
  morgan(
    ":request-id :method :safe-url :status :response-time ms"
  )
);

app.use(
  express.json()
);

app.use(
  createAuthSessionMiddleware()
);


app.get(
  "/",
  (
    request,
    response
  ) => {

    response.json({
      message:
        "GIS Backend Running",
    });

  }
);


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api",
  requireAuthentication,
  requireGISReadRole,
  apiRoutes
);


app.use(
  notFoundHandler
);

app.use(
  errorHandler
);


export default app;
