import {
  Router,
} from "express";

import featureRoutes
  from "./featureRoutes.js";

import wfsRoutes
  from "./wfs.routes.js";

import buildingRoutes
  from "./buildingRoutes.js";

import publicFacilityRoutes
  from "./publicFacilityRoutes.js";


const router =
  Router();

router.use(
  "/features",
  featureRoutes
);
router.use(
  "/wfs",
  wfsRoutes
);
router.use(
  "/buildings",
  buildingRoutes
);
router.use(
  "/public-facilities",
  publicFacilityRoutes
);

export default router;
