# Product Requirements Document: NFIG Cognito Pilot App

## Introduction/Overview

The **NFIG Cognito Pilot App** is a technical Proof of Concept (PoC) designed to empirically test whether AWS Cognito can serve as an "Enterprise Authentication Proxy" for the National Oceanic and Atmospheric Administration (NOAA). This is a disposable testing application that will never go into production, but serves as a critical evaluation tool for the National Federated Identity Gateway (NFIG) initiative.

### Problem Statement
NOAA needs a broker to bridge central Identity Providers (IDPs) like Login.gov and Sso.noaa.gov with downstream applications. Current SaaS solutions like AWS Cognito have "Protocol Asymmetry"—they support SAML backends but force OIDC on the frontend. This creates a potential "refactoring tax" for legacy applications that may be too high to justify adoption.

### Primary Goal
Measure the **Application Integration Level of Effort (LOE)** and verify if Cognito can effectively handle:
1. Federated authentication from upstream IDPs
2. Claim mapping and attribute passthrough
3. Single Logout (SLO) capabilities
4. Scalability for future load testing

This PoC will provide decision-makers with clear go/no-go criteria for whether Cognito is viable for NOAA's enterprise identity architecture.

## Goals

1. **Validate Federation Capability**: Confirm Cognito can successfully redirect to upstream IDPs and handle authentication callbacks
2. **Test Claim Passthrough**: Verify if Cognito correctly passes mapped attributes (Email, Group membership, etc.) from upstream IDPs or strips them out
3. **Evaluate Single Logout**: Test if Cognito supports effective Single Logout (SLO) across the federation chain
4. **Document Integration Process**: Create comprehensive documentation that enables other NOAA teams (using different tech stacks) to replicate integration testing
5. **Measure Integration LOE**: Quantify developer effort required to integrate with Cognito as an authentication proxy
6. **Prepare Load Testing Infrastructure**: Ensure the app architecture supports future performance testing with tools like JMeter

## User Stories

### End-User Stories
- **US-1**: As a NOAA employee, I want to click "Sign In" and be seamlessly redirected to Cognito's Hosted UI, so I can authenticate using my existing credentials
- **US-2**: As a NOAA employee, I want to click "Sign Out" and have my session completely terminated across all systems, so my account remains secure
- **US-3**: As a NOAA employee, I want my authentication experience to be consistent regardless of whether I use Login.gov or Sso.noaa.gov as my IDP

### Developer/Evaluator Stories
- **US-4**: As a NOAA developer, I need to see the raw JSON of the `id_token` and `access_token` on a Debug Dashboard, so I can verify what claims Cognito is actually passing through
- **US-5**: As a NOAA developer, I need clear documentation of the integration process, so I can replicate this with my application's specific tech stack
- **US-6**: As a technical evaluator, I need quantifiable metrics on integration complexity, so I can make informed decisions about Cognito adoption
- **US-7**: As a load testing engineer, I need a stateless/serverless-compatible authentication flow, so I can perform future performance testing

## Functional Requirements

### FR-1: Federation Test Requirements
1. **FR-1.1**: The application MUST provide a "Sign In" button on the home page
2. **FR-1.2**: Clicking "Sign In" MUST redirect the user to the Cognito Hosted UI using the `authorization_endpoint` from the OIDC Discovery configuration
3. **FR-1.3**: The application MUST handle the OAuth2 callback gracefully, processing authorization codes and exchanging them for tokens
4. **FR-1.4**: The application MUST display authentication errors clearly if the callback fails
5. **FR-1.5**: Upon successful authentication, the application MUST display the authenticated user's session state

### FR-2: Claim Inspection Test Requirements (Critical)
6. **FR-2.1**: The application MUST provide a "Debug Dashboard" page accessible to authenticated users
7. **FR-2.2**: The Debug Dashboard MUST display the raw JSON of the `id_token` with syntax highlighting for readability
8. **FR-2.3**: The Debug Dashboard MUST display the raw JSON of the `access_token` with syntax highlighting
9. **FR-2.4**: The Debug Dashboard MUST display claims extracted from the UserInfo endpoint (`userinfo_endpoint`)
10. **FR-2.5**: The Debug Dashboard MUST clearly label which claims originate from which source (id_token vs. access_token vs. UserInfo)
11. **FR-2.6**: The Debug Dashboard MUST include a timestamp showing when tokens were issued and when they expire
12. **FR-2.7**: The Debug Dashboard MUST allow developers to copy token JSON to clipboard for external analysis

### FR-3: Session & Logout Test Requirements
13. **FR-3.1**: The application MUST provide a "Sign Out" button accessible from any authenticated page
14. **FR-3.2**: Clicking "Sign Out" MUST clear the local application session
15. **FR-3.3**: Clicking "Sign Out" MUST redirect the user to Cognito's `end_session_endpoint` to terminate the Cognito session
16. **FR-3.4**: The logout flow MUST include proper redirect parameters to return users to the application home page after logout
17. **FR-3.5**: After logout, attempting to access protected pages MUST redirect back to the sign-in flow
18. **FR-3.6**: The application MUST document whether Cognito successfully propagates logout to the upstream IDP (Login.gov/Sso.noaa.gov)

### FR-4: Load Testing Preparation Requirements
19. **FR-4.1**: The authentication flow MUST be stateless or serverless-compatible
20. **FR-4.2**: The application MUST NOT rely on server-side session storage that would prevent horizontal scaling
21. **FR-4.3**: The application SHOULD use JWT-based session management suitable for distributed load testing
22. **FR-4.4**: The application MUST include documentation on how to configure load testing tools (e.g., JMeter) to test the authentication flow

### FR-5: Documentation Requirements
23. **FR-5.1**: The application MUST include a comprehensive README.md with:
    - Quick start setup instructions
    - Prerequisites and dependencies
    - Environment variable configuration
    - How to run the application locally
    - Troubleshooting common issues
24. **FR-5.2**: The application MUST include detailed integration documentation in a `/docs` folder covering:
    - OIDC Discovery configuration mapping
    - Step-by-step Cognito setup process
    - Claim mapping verification procedures
    - SLO testing methodology
    - Integration LOE metrics collection
    - Lessons learned and gotchas
25. **FR-5.3**: Documentation MUST be stack-agnostic enough that teams using Java, Python, .NET, etc. can adapt the integration patterns
26. **FR-5.4**: Documentation MUST include clear diagrams of the authentication flow

### FR-6: Environment Variables Mapping
27. **FR-6.1**: The application MUST use environment variables for all sensitive configuration
28. **FR-6.2**: The application MUST provide a `.env.example` file with all required variables documented (with placeholder values only)
29. **FR-6.3**: The application MUST document the mapping between OIDC Discovery JSON fields and environment variables:
    - `issuer` → Used for token validation
    - `authorization_endpoint` → OAuth2 authorization redirect
    - `token_endpoint` → Token exchange endpoint
    - `userinfo_endpoint` → Claims retrieval endpoint
    - `end_session_endpoint` → Logout endpoint
    - `jwks_uri` → Public key retrieval for token verification
30. **FR-6.4**: The application MUST use `.env.local` (or equivalent) for local development secrets (Client ID/Secret)
31. **FR-6.5**: The application MUST include a `.gitignore` file that explicitly excludes all environment files and secrets

### FR-7: Security Requirements (GitHub Safety)
32. **FR-7.1**: The repository MUST include a comprehensive `.gitignore` that prevents committing:
    - All `.env` files and variants
    - Client secrets and credentials
    - Token files and test results containing real tokens
    - AWS credentials
33. **FR-7.2**: The application MUST include a `SECURITY.md` document explaining:
    - What information is sensitive and must be protected
    - How to obtain required credentials from NOAA Cognito administrators
    - Best practices for local development without exposing secrets
34. **FR-7.3**: All code examples in documentation MUST use placeholder values (e.g., `YOUR_CLIENT_ID_HERE`, `xxxxx-xxxxx-xxxxx`)
35. **FR-7.4**: The README MUST include a prominent warning about not committing secrets to the repository
36. **FR-7.5**: The OIDC Discovery JSON endpoints in documentation are PUBLIC endpoints and safe to share

### FR-8: User Interface Requirements
37. **FR-8.1**: The application UI MUST follow a clean, federal/minimalist aesthetic
38. **FR-8.2**: The application MUST use Tailwind CSS for styling
39. **FR-8.3**: The application MUST clearly indicate authentication state (signed in vs. signed out)
40. **FR-8.4**: The application MUST be responsive and functional on desktop browsers (mobile optimization not required)

## Non-Goals (Out of Scope)

1. **Production Deployment**: This application will NEVER be deployed to production. It is a testing tool only.
2. **Full Application Features**: No business logic, data management, or real application features are required beyond authentication testing.
3. **Multi-tenancy**: No need to support multiple organizations or tenant isolation.
4. **Custom IDP Configuration**: The PoC uses the provided OIDC Discovery JSON as immutable configuration. Testing other IDPs is out of scope.
5. **Mobile Applications**: Testing mobile app integration with Cognito is not part of this PoC.
6. **Fine-grained Authorization**: Focus is on authentication and claim retrieval, not on role-based access control or authorization policies.
7. **Database Integration**: No persistent data storage is required beyond session management.
8. **Advanced Security Hardening**: While basic security best practices should be followed, extensive security measures for production are unnecessary.
9. **Real Credential Management**: This PRD does not address enterprise-level credential rotation, secrets management systems (like HashiCorp Vault), or production-grade security infrastructure.

## Design Considerations

### User Interface
- **Home Page**: Simple landing page with "Sign In" button and project description
- **Debug Dashboard**: Full-screen view with multiple panels showing:
  - ID Token JSON (expandable/collapsible)
  - Access Token JSON (expandable/collapsible)
  - UserInfo Claims (expandable/collapsible)
  - Token Metadata (issuer, expiration, timestamps)
  - Copy-to-clipboard functionality
- **Navigation**: Minimal top navigation showing authentication state and Sign Out button
- **Styling**: Use Tailwind's default color palette with emphasis on readability and clarity

### Error Handling
- Authentication failures should display clear error messages
- Token expiration should be handled gracefully with re-authentication prompts
- Network errors should be caught and displayed to users

## Technical Considerations

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Authentication Library**: NextAuth.js configured with CognitoProvider
- **Styling**: Tailwind CSS
- **Language**: TypeScript (recommended for type safety)
- **Environment Management**: `.env.local` for secrets

### OIDC Discovery Configuration (Immutable Source of Truth)

The application must use this exact OIDC Discovery JSON for all endpoint configuration:

```json
{
  "authorization_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/authorize",
  "end_session_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/logout",
  "id_token_signing_alg_values_supported": ["RS256"],
  "issuer": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq",
  "jwks_uri": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq/.well-known/jwks.json",
  "response_types_supported": ["code", "token"],
  "revocation_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/revoke",
  "scopes_supported": ["openid", "email", "phone", "profile"],
  "subject_types_supported": ["public"],
  "token_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/token",
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "userinfo_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/userInfo"
}
```

### Environment Variables Mapping

| OIDC Discovery Field | Purpose | Environment Variable (Example) | Notes |
|---------------------|---------|--------------------------------|-------|
| `issuer` | Token validation | `COGNITO_ISSUER` | Used to verify token issuer claim |
| `authorization_endpoint` | OAuth2 authorization | Derived from provider config | Used for initial auth redirect |
| `token_endpoint` | Token exchange | Derived from provider config | Exchange auth code for tokens |
| `userinfo_endpoint` | Claims retrieval | `COGNITO_USERINFO_ENDPOINT` | Fetch additional user claims |
| `end_session_endpoint` | Logout | `COGNITO_LOGOUT_ENDPOINT` | Single Logout endpoint |
| `jwks_uri` | Token verification | Derived from provider config | Fetch public keys for JWT validation |
| N/A | Client credentials | `COGNITO_CLIENT_ID` | Provided by NOAA Cognito admin |
| N/A | Client credentials | `COGNITO_CLIENT_SECRET` | Provided by NOAA Cognito admin |

### Architecture Constraints
- Must support serverless deployment (e.g., Vercel, AWS Lambda)
- Session management must be JWT-based (no server-side session store)
- All authentication logic must be contained in API routes for testability
- No backend database required

## Success Metrics

This PoC will be evaluated using clear **go/no-go decision criteria**:

### Critical Success Criteria (Must Pass)
1. **Claim Passthrough Test**: 
   - **GO**: Cognito successfully passes at least 80% of mapped attributes from upstream IDP (Email, Name, Groups) in tokens
   - **NO-GO**: Cognito strips critical claims or requires extensive custom claim handling

2. **Single Logout Test**:
   - **GO**: Clicking "Sign Out" successfully terminates the Cognito session and optionally propagates to upstream IDP
   - **NO-GO**: Logout fails or leaves orphaned sessions in the federation chain

3. **Integration LOE**:
   - **GO**: A developer with OIDC experience can integrate Cognito in ≤8 hours (1 work day)
   - **NO-GO**: Integration requires >16 hours due to complex workarounds or poor documentation

### Secondary Success Criteria (Important but Not Blocking)
4. **Token Structure**: Tokens contain standard OIDC claims in expected format
5. **Error Handling**: Authentication errors are clear and actionable
6. **Load Testing Readiness**: Application can be successfully load tested with JMeter or similar tools
7. **Documentation Quality**: Other NOAA teams can replicate integration without additional assistance

### Quantitative Metrics to Collect
- **Integration Time**: Total developer hours from project setup to first successful authentication
- **Claim Completeness**: Percentage of expected claims present in tokens
- **Error Rate**: Number of failed authentication attempts during testing
- **Documentation Clarity**: Feedback from other teams attempting replication (qualitative)
- **Code Complexity**: Lines of code required for integration vs. direct IDP integration

### Evaluation Deliverable
The final evaluation report must include:
- Go/No-Go recommendation for Cognito adoption at NOAA
- Detailed breakdown of claims testing results
- Quantified integration LOE metrics
- List of workarounds or customizations required
- Comparison to direct IDP integration complexity
- Recommendations for production implementation (if GO)

## Open Questions

1. **Upstream IDP Testing**: Which upstream IDP should be prioritized for initial testing—Login.gov or Sso.noaa.gov? Or both?
2. **Claim Mapping Configuration**: Who is responsible for configuring claim mappings in the Cognito User Pool? Is this already configured or needs documentation?
3. **Load Testing Scope**: What specific load testing scenarios are planned for future phases (concurrent users, authentication requests per second, etc.)?
4. **Multi-IDP Testing**: Should the PoC test authentication with both Login.gov AND Sso.noaa.gov, or is a single IDP sufficient for evaluation?
5. **Token Refresh**: Should the PoC test refresh token functionality, or is initial authentication sufficient?
6. **Group Membership**: Are group/role claims expected to be passed through, and if so, what is the expected format?
7. **Evaluation Timeline**: What is the deadline for completing the PoC evaluation and delivering the go/no-go recommendation?
8. **Success Criteria Thresholds**: Have stakeholders confirmed the 80% claim passthrough and 8-hour integration LOE thresholds, or should these be adjusted?

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Author**: Lead Architect and Technical Product Manager, NFIG Initiative  
**Status**: Draft - Awaiting Review
