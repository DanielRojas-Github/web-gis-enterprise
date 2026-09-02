import {

  Router,

} from "express";

import {

  getRoads,
  getBuildings,

} from "../controllers/wfsController.js";

import {

  validateRequest,

} from "../middleware/validateRequest.js";

import {

  validateWfsQuery,

} from "../validators/wfsValidator.js";


const router =

  Router();


router.get(

  "/roads",

  validateRequest(

    validateWfsQuery

  ),

  getRoads

);


router.get(

  "/buildings",

  validateRequest(

    validateWfsQuery

  ),

  getBuildings

);


export default router;