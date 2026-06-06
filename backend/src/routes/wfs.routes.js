import { Router }
from "express";

const router = Router();

router.get(
  "/roads",
  (req, res) => {

    res.json({
      type: "FeatureCollection",

      features: [
        {
          type: "Feature",

          properties: {
            id: 1,
            name: "Road A",
          },

          geometry: {
            type: "LineString",

            coordinates: [
              [-63.680, -22.020],
              [-63.675, -22.015],
              [-63.670, -22.010],
            ],
          },
        },
      ],
    });
  }
);

export default router;