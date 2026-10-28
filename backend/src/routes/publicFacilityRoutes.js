import {
  Router,
} from "express";

import {
  createPublicFacilityController,
  deletePublicFacilityController,
  getPublicFacilitiesController,
  updatePublicFacilityController,
} from "../controllers/publicFacilityController.js";

import {
  requireGISWriteRole,
} from "../middleware/requireGISWriteRole.js";

import {
  requireTrustedOrigin,
} from "../middleware/requireTrustedOrigin.js";

import {
  validateRequest,
} from "../middleware/validateRequest.js";

import {
  validatePublicFacilityBody,
  validatePublicFacilityId,
} from "../validators/publicFacilityValidator.js";

const router = Router();

router.get("/", getPublicFacilitiesController);

router.post(
  "/",
  requireTrustedOrigin,
  requireGISWriteRole,
  validateRequest(validatePublicFacilityBody),
  createPublicFacilityController
);

router.put(
  "/:id",
  requireTrustedOrigin,
  requireGISWriteRole,
  validateRequest(validatePublicFacilityId),
  validateRequest(validatePublicFacilityBody),
  updatePublicFacilityController
);

router.delete(
  "/:id",
  requireTrustedOrigin,
  requireGISWriteRole,
  validateRequest(validatePublicFacilityId),
  deletePublicFacilityController
);

export default router;
