import {
  env,
} from "../config/env.js";

export const requireGISReadRole = (
  request,
  response,
  next
) => {
  const userRoles = request.authenticatedUser?.roles ?? [];
  const hasReadRole = env.auth.readRoles.some(
    (role) => userRoles.includes(role)
  );

  if (!hasReadRole) {
    return response.status(403).json({
      success: false,
      error: {
        code: "GIS_READ_ROLE_REQUIRED",
        message: "Your account does not have a GIS read role.",
      },
    });
  }

  return next();
};
