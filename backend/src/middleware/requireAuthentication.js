import {
  env,
} from "../config/env.js";

export const requireAuthentication = (
  request,
  response,
  next
) => {
  if (!env.auth.enabled) {
    return response.status(503).json({
      success: false,
      error: {
        code: "AUTHENTICATION_NOT_CONFIGURED",
        message: "Configure the OIDC provider before using the API.",
      },
    });
  }

  if (!request.session?.user) {
    return response.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Sign in to access this resource.",
      },
    });
  }

  request.authenticatedUser = request.session.user;
  return next();
};
