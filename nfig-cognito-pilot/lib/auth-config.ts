/**
 * Cognito OIDC Configuration for NFIG Pilot App
 * 
 * This file contains the OIDC Discovery endpoints from the Cognito User Pool.
 * These endpoints are PUBLIC and safe to commit to the repository.
 * 
 * Source: OIDC Discovery JSON from PRD
 * User Pool: us-east-1_8KX012Qnq
 * Domain: us-east-18kx012qnq.auth.us-east-1.amazoncognito.com
 */

/**
 * Cognito Issuer URL
 * Used for token validation and verification
 */
export const COGNITO_ISSUER = process.env.COGNITO_ISSUER || 
  "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq";

/**
 * OAuth2 Authorization Endpoint
 * Users are redirected here to authenticate via Cognito Hosted UI
 */
export const COGNITO_AUTHORIZATION_ENDPOINT = 
  "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/authorize";

/**
 * OAuth2 Token Endpoint
 * Used to exchange authorization code for access/ID tokens
 */
export const COGNITO_TOKEN_ENDPOINT = 
  "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/token";

/**
 * OIDC UserInfo Endpoint
 * Used to fetch additional user claims beyond those in the ID token
 */
export const COGNITO_USERINFO_ENDPOINT = 
  "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/userInfo";

/**
 * End Session Endpoint (Logout)
 * Used to terminate the Cognito session and test Single Logout (SLO)
 */
export const COGNITO_END_SESSION_ENDPOINT = 
  "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/logout";

/**
 * JSON Web Key Set (JWKS) URI
 * Used to retrieve public keys for JWT signature verification
 */
export const COGNITO_JWKS_URI = 
  "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq/.well-known/jwks.json";

/**
 * OAuth2 Token Revocation Endpoint
 * Used to revoke refresh tokens
 */
export const COGNITO_REVOCATION_ENDPOINT = 
  "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/revoke";

/**
 * Supported OAuth2 response types
 */
export const SUPPORTED_RESPONSE_TYPES = ["code", "token"];

/**
 * Supported OIDC scopes
 */
export const SUPPORTED_SCOPES = ["openid", "email", "phone", "profile"];

/**
 * ID Token signing algorithm
 */
export const ID_TOKEN_SIGNING_ALG = "RS256";

/**
 * Complete OIDC Discovery configuration object
 * Matches the JSON provided in the PRD
 */
export const OIDC_DISCOVERY_CONFIG = {
  authorization_endpoint: COGNITO_AUTHORIZATION_ENDPOINT,
  end_session_endpoint: COGNITO_END_SESSION_ENDPOINT,
  id_token_signing_alg_values_supported: [ID_TOKEN_SIGNING_ALG],
  issuer: COGNITO_ISSUER,
  jwks_uri: COGNITO_JWKS_URI,
  response_types_supported: SUPPORTED_RESPONSE_TYPES,
  revocation_endpoint: COGNITO_REVOCATION_ENDPOINT,
  scopes_supported: SUPPORTED_SCOPES,
  subject_types_supported: ["public"],
  token_endpoint: COGNITO_TOKEN_ENDPOINT,
  token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
  userinfo_endpoint: COGNITO_USERINFO_ENDPOINT,
} as const;
