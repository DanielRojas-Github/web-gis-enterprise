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


app.use(
  cors()
);

app.use(
  helmet()
);

app.use(
  requestId
);

app.use(
  morgan(
    ":request-id :method :url :status :response-time ms"
  )
);

app.use(
  express.json()
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
  "/api",
  apiRoutes
);


app.use(
  notFoundHandler
);

app.use(
  errorHandler
);


export default app;