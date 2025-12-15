# NFIG Cognito Integration Guide

## Overview

This guide documents the integration process for using AWS Cognito as an Enterprise Authentication Proxy for NOAA applications. It's designed to be stack-agnostic so teams using different frameworks can adapt these patterns.

## Integration Summary

**Integration Level of Effort (LOE)**: ~6-8 hours for OIDC-experienced developer

**Key Steps**:
1. Configure OIDC client (1 hour)
2. Implement authentication flow (2-3 hours)
3. Token capture and validation (2 hours)
4. Debug and test (1-2 hours)

## OIDC Configuration Mapping

### Required Information from Cognito Admin

| Item | Purpose | Example |
|------|---------|---------|
| Client ID | Application identifier | `5q5mnevpmi7mms0i8prrs4ihgk` |
| Client Secret | Application credential | Obtain securely from admin |
| Issuer | Token validation | `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq` |

### OIDC Discovery Endpoints

All applications need these standard OIDC endpoints:

- **Authorization Endpoint**: Where users are redirected to log in
- **Token Endpoint**: Where authorization codes are exchanged for tokens
- **UserInfo Endpoint**: Where additional user claims can be retrieved
- **JWKS URI**: Where public keys for JWT validation are published
- **End Session Endpoint**: Where logout requests are sent

## Authentication Flow

### Step 1: Redirect to Cognito

```
GET https://[domain]/oauth2/authorize?
  response_type=code&
  client_id=[YOUR_CLIENT_ID]&
  redirect_uri=[YOUR_CALLBACK_URL]&
  scope=openid+email+profile&
  code_challenge=[PKCE_CHALLENGE]&
  code_challenge_method=S256
```

### Step 2: Handle Callback

Your app receives:
```
GET [YOUR_CALLBACK_URL]?code=[AUTHORIZATION_CODE]&state=[STATE]
```

### Step 3: Exchange Code for Tokens

```
POST https://[domain]/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=[AUTHORIZATION_CODE]&
client_id=[YOUR_CLIENT_ID]&
client_secret=[YOUR_CLIENT_SECRET]&
redirect_uri=[YOUR_CALLBACK_URL]&
code_verifier=[PKCE_VERIFIER]
```

Response:
```json
{
  "access_token": "eyJraWQiOiI...",
  "id_token": "eyJraWQiOiJ...",
  "refresh_token": "eyJjdHkiOiJ...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## Claim Verification

### Expected Claims in ID Token

```json
{
  "sub": "user-unique-id",
  "email": "user@noaa.gov",
  "email_verified": true,
  "cognito:username": "username",
  "cognito:groups": ["group1", "group2"],
  "iss": "https://cognito-idp.us-east-1.amazonaws.com/...",
  "aud": "your-client-id",
  "exp": 1234567890,
  "iat": 1234564290
}
```

### Claim Passthrough Testing

Use the Debug Dashboard to verify:
1. Which claims are present in ID token vs. access token
2. Whether upstream IDP attributes (email, groups) are passed through
3. If custom claims from federated IDPs survive the Cognito mapping

**Key Finding**: Document claim completeness percentage (e.g., "8 out of 10 expected claims present = 80%")

## Single Logout (SLO)

### Logout Flow

1. **Clear Local Session**: Remove application session/cookies
2. **Redirect to Cognito**: 
```
GET https://[domain]/logout?
  client_id=[YOUR_CLIENT_ID]&
  logout_uri=[POST_LOGOUT_REDIRECT_URI]
```
3. **Return to Application**: Cognito redirects user back to `logout_uri`

### SLO Testing Methodology

**Test Scenario 1: Local Logout**
1. Sign in to application
2. Click "Sign Out"
3. Verify session is cleared
4. Try accessing protected route → should redirect to login

**Test Scenario 2: Cognito Logout**
1. Sign in to application
2. Click "Sign Out"
3. Verify redirect to Cognito logout endpoint
4. Verify return to application homepage
5. Try signing in again → should require re-authentication (not use old session)

**Test Scenario 3: Upstream IDP Logout** (if applicable)
1. Sign in via federated IDP (e.g., Login.gov)
2. Sign out from application
3. Check if upstream IDP session is also terminated
4. Document whether Cognito propagates logout to federated IDP

**Expected Result**: Cognito may NOT propagate logout to upstream IDP. Document this limitation.

## Stack-Specific Guidance

### Next.js (This Implementation)

- **Library**: NextAuth.js v5
- **Session**: JWT-based (stateless)
- **Key Files**: `/app/api/auth/[...nextauth]/route.ts`

### Java/Spring Boot

- **Library**: Spring Security OAuth2 Client
- **Session**: Server-side session store
- **Key Configuration**: `application.yml` with OIDC provider details

### Python/Flask

- **Library**: Authlib or Flask-OIDC
- **Session**: Flask session management
- **Key Configuration**: OIDC client registration in app config

### .NET/ASP.NET Core

- **Library**: Microsoft.AspNetCore.Authentication.OpenIdConnect
- **Session**: ASP.NET Core Identity
- **Key Configuration**: `Startup.cs` or `Program.cs`

## Common Issues and Solutions

### Issue: "Login pages unavailable"

**Cause**: Cognito Hosted UI not enabled for app client  
**Solution**: In AWS Console, enable "Hosted UI" for the app client and assign identity providers

### Issue: Missing claims in tokens

**Cause**: Claim mapping not configured in Cognito  
**Solution**: Configure attribute mapping in Cognito User Pool → Identity Providers

### Issue: Session not persisting

**Cause**: Cookie configuration or HTTPS requirements  
**Solution**: Ensure proper cookie settings and use HTTPS in production

### Issue: Logout doesn't terminate Cognito session

**Cause**: Not redirecting to end_session_endpoint  
**Solution**: Implement proper SLO flow as documented above

## Integration LOE Metrics

Track these metrics during integration:

- **Setup Time**: Time to configure client and environment
- **Development Time**: Time to implement auth flow
- **Debug Time**: Time spent troubleshooting issues
- **Total LOE**: Sum of above

**Target**: ≤8 hours for OIDC-experienced developer

## Success Criteria

✅ User can sign in via Cognito Hosted UI  
✅ Tokens are captured and validated  
✅ Claims are accessible in application  
✅ ≥80% of expected claims are present  
✅ Logout clears local and Cognito sessions  
✅ Protected routes redirect unauthenticated users

## Next Steps

1. Complete integration following this guide
2. Use Debug Dashboard to verify claims
3. Test SLO functionality
4. Document findings and integration LOE
5. Provide go/no-go recommendation for Cognito adoption

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Audience**: NOAA development teams
