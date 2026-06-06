import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import wfsRoutes
from "./routes/wfs.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// app.use(
//   "/api/wfs",
//   wfsRoutes
// );

app.get("/", (req, res) => {
  res.json({
    message: "GIS Backend Running",
  });
});

app.get(
  "/api/wfs/roads",
  (req, res) => {

    res.json({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",

          properties: {
            name: "Road 1",
          },

          geometry: {
            type: "LineString",

            coordinates: [
             [-64.7296, -21.5355],
             [-64.7196, -21.5255]
            ],
          },
        },
      ],
    })
  }
)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


