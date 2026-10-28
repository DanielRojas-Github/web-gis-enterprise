import {
  env,
} from "../config/env.js";

export const requireGISWriteRole = (
  request,
  response,
  next
) => {
  const userRoles = request.authenticatedUser?.roles ?? [];
  const canWrite = env.auth.writeRoles.some(
    (role) => userRoles.includes(role)
  );

  if (!canWrite) {
    return response.status(403).json({
      success: false,
      error: {
        code: "GIS_WRITE_ROLE_REQUIRED",
        message: "Your account does not have a GIS write role.",
      },
    });
  }

  return next();
};
