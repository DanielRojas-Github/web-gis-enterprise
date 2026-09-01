import {
  Router,
} from "express";

import {
  getBuildingsController,
} from "../controllers/buildingController.js";


const router =
  Router();


router.get(
  "/",
  getBuildingsController
);


export default router;