import {
  allowInsecureRequests,
  discovery,
} from "openid-client";

import {
  env,
} from "../config/env.js";

let oidcConfiguration;

export const initializeOidcClient = async () => {
  if (!env.auth.enabled) {
    return;
  }

  const discoveryOptions =
    env.auth.allowInsecureLocalIssuer
      ? { execute: [allowInsecureRequests] }
      : undefined;

  oidcConfiguration = await discovery(
    new URL(env.auth.issuer),
    env.auth.clientId,
    {
      client_secret: env.auth.clientSecret,
    },
    undefined,
    discoveryOptions
  );
};

export const getOidcConfiguration = () => {
  if (!oidcConfiguration) {
    throw new Error("OIDC client has not been initialized");
  }

  return oidcConfiguration;
};
