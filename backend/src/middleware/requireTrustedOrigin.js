import {
  env,
} from "../config/env.js";

export const requireTrustedOrigin = (
  request,
  response,
  next
) => {
  const origin = request.get("origin");

  if (!origin || !env.corsAllowedOrigins.includes(origin)) {
    return response.status(403).json({
      success: false,
      error: {
        code: "UNTRUSTED_ORIGIN",
        message: "A trusted browser origin is required for GIS writes.",
      },
    });
  }

  return next();
};
