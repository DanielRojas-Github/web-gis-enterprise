import {
  Router,
} from "express";

import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  calculatePKCECodeChallenge,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";

import {
  env,
} from "../config/env.js";

import {
  getOidcConfiguration,
} from "../services/oidcClient.js";

const router = Router();

const saveSession = (request) =>
  new Promise((resolve, reject) => {
    request.session.save((error) =>
      error ? reject(error) : resolve()
    );
  });

const regenerateSession = (request) =>
  new Promise((resolve, reject) => {
    request.session.regenerate((error) =>
      error ? reject(error) : resolve()
    );
  });

const destroySession = (request) =>
  new Promise((resolve, reject) => {
    if (!request.session) {
      resolve();
      return;
    }

    request.session.destroy((error) =>
      error ? reject(error) : resolve()
    );
  });

const readClaimPath = (claims, path) =>
  path.reduce(
    (value, key) => value?.[key],
    claims
  );

const getIdentityRoles = (claims) => {
  const value = readClaimPath(
    claims,
    env.auth.rolesClaim
  );

  if (typeof value === "string") {
    return [value];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(
    value.filter((role) => typeof role === "string")
  )];
};

const unavailable = (response) =>
  response.status(503).json({
    success: false,
    error: {
      code: "AUTHENTICATION_NOT_CONFIGURED",
      message: "Configure the OIDC provider before signing in.",
    },
  });

router.get("/login", async (request, response, next) => {
  if (!env.auth.enabled) {
    return unavailable(response);
  }

  try {
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge =
      await calculatePKCECodeChallenge(codeVerifier);
    const state = randomState();
    const nonce = randomNonce();

    request.session.oidcTransaction = {
      codeVerifier,
      state,
      nonce,
    };

    await saveSession(request);

    const authorizationUrl = buildAuthorizationUrl(
      getOidcConfiguration(),
      new URLSearchParams({
        redirect_uri: env.auth.redirectUri,
        scope: "openid profile email",
        response_type: "code",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
        nonce,
      })
    );

    return response.redirect(authorizationUrl.href);
  } catch (error) {
    return next(error);
  }
});

router.get("/callback", async (request, response) => {
  if (!env.auth.enabled) {
    return unavailable(response);
  }

  const transaction = request.session?.oidcTransaction;

  if (!transaction) {
    return response.redirect(
      new URL(
        "/login?error=authentication_failed",
        env.auth.frontendUrl
      ).toString()
    );
  }

  try {
    const currentUrl = new URL(
      request.originalUrl,
      env.auth.redirectUri
    );

    const tokens = await authorizationCodeGrant(
      getOidcConfiguration(),
      currentUrl,
      {
        pkceCodeVerifier: transaction.codeVerifier,
        expectedState: transaction.state,
        expectedNonce: transaction.nonce,
      }
    );

    const claims = tokens.claims();

    if (!claims?.sub) {
      throw new Error("The OIDC identity has no subject claim");
    }

    await regenerateSession(request);

    request.session.user = {
      issuer: claims.iss,
      subject: claims.sub,
      email: claims.email ?? null,
      name: claims.name ?? null,
      roles: getIdentityRoles(claims),
    };
    request.session.idToken = tokens.id_token;

    await saveSession(request);

    return response.redirect(
      new URL("/dashboard", env.auth.frontendUrl).toString()
    );
  } catch {
    await destroySession(request);

    return response.redirect(
      new URL(
        "/login?error=authentication_failed",
        env.auth.frontendUrl
      ).toString()
    );
  }
});

router.get("/me", (request, response) => {
  if (!env.auth.enabled) {
    return unavailable(response);
  }

  if (!request.session?.user) {
    return response.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Sign in to continue.",
      },
    });
  }

  return response.json({
    success: true,
    user: {
      ...request.session.user,
      permissions: {
        canRead: [
          ...env.auth.readRoles,
          ...env.auth.writeRoles,
        ].some((role) => request.session.user.roles.includes(role)),
        canWrite: env.auth.writeRoles.some(
          (role) => request.session.user.roles.includes(role)
        ),
      },
    },
  });
});

router.post("/logout", async (request, response, next) => {
  if (!env.auth.enabled) {
    return unavailable(response);
  }

  const origin = request.get("origin");

  if (
    origin &&
    !env.corsAllowedOrigins.includes(origin)
  ) {
    return response.status(403).json({
      success: false,
      error: {
        code: "ORIGIN_NOT_ALLOWED",
        message: "The request origin is not allowed.",
      },
    });
  }

  try {
    const idToken = request.session?.idToken;
    let logoutUrl = null;

    if (idToken) {
      try {
        logoutUrl = buildEndSessionUrl(
          getOidcConfiguration(),
          {
            id_token_hint: idToken,
            post_logout_redirect_uri:
              env.auth.frontendLogoutUri,
          }
        ).href;
      } catch {
        // Some OIDC providers do not publish an end-session endpoint.
      }
    }

    await destroySession(request);

    response.clearCookie(env.auth.cookieName, {
      httpOnly: true,
      secure: env.auth.cookieSecure,
      sameSite: env.auth.cookieSameSite,
    });

    return response.json({
      success: true,
      logoutUrl,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
